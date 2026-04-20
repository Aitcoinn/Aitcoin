// Copyright (c) 2021-2024 The AITCOIN developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

// ============================================================
// AI_CONNECTOR.CPP — Protocol-Level AI Validator Connector
//
// DESAIN:
//   1. Bangun JSON payload dari CBlock (hash, txids, metadata)
//   2. Kirim via HTTP POST ke AI layer (POSIX socket, non-blocking)
//   3. Parse JSON response: score, risk, decision
//   4. Return AIResult — keputusan dibuat di validation.cpp
//
// KEAMANAN & PERFORMA:
//   - Pure POSIX socket: tidak butuh curl / boost.asio / libhttp
//   - Timeout 200ms (configurable, max 500ms)
//   - Semua error path → success=false, blockchain lanjut normal
//   - Thread-safe via mutex di result cache
//   - Maksimal 1 request per block (deduplikasi via block hash)
// ============================================================

#include "ai_connector.h"
#include "primitives/block.h"
#include "util.h"

#include <arpa/inet.h>
#include <atomic>
#include <chrono>
#include <cstring>
#include <errno.h>
#include <fcntl.h>
#include <mutex>
#include <netdb.h>
#include <netinet/in.h>
#include <sstream>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

// ── DEFAULT CONFIGURATION ─────────────────────────────────────
static const std::string DEFAULT_ENDPOINT = "http://127.0.0.1:3000/ai/validate";
static const int         DEFAULT_TIMEOUT_MS = 200;
static const int         MAX_TIMEOUT_MS     = 500;

// ── RUNTIME CONFIG (setable via InitAIConnector) ──────────────
static std::string s_endpoint;
static int         s_timeoutMs = 0;      // 0 = belum diinit → pakai default
static std::mutex  s_configMutex;

// ── AVAILABILITY TRACKING ─────────────────────────────────────
static std::atomic<bool> s_available{false};

// ── LAST RESULT CACHE (thread-safe) ──────────────────────────
static std::mutex  s_lastMutex;
static AIResult    s_lastResult;
static std::string s_lastHash;

// ─────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────

// Konfigurasi aktif (baca gArgs kalau belum diinit manual)
static std::string GetEndpoint() {
    std::lock_guard<std::mutex> lk(s_configMutex);
    if (!s_endpoint.empty()) return s_endpoint;
    return gArgs.GetArg("-aivalidator_endpoint", DEFAULT_ENDPOINT);
}

static int GetTimeoutMs() {
    std::lock_guard<std::mutex> lk(s_configMutex);
    if (s_timeoutMs > 0) return std::min(s_timeoutMs, MAX_TIMEOUT_MS);
    int t = (int)gArgs.GetArg("-aivalidator_timeout", (int64_t)DEFAULT_TIMEOUT_MS);
    return std::min(std::max(t, 50), MAX_TIMEOUT_MS);
}

// Parse URL → host, port, path
static bool ParseURL(const std::string& url,
                     std::string& host, int& port, std::string& path)
{
    std::string s = url;
    if (s.substr(0, 7) == "http://")  s = s.substr(7);
    else if (s.substr(0, 8) == "https://") s = s.substr(8);

    auto slash = s.find('/');
    std::string hostport = (slash != std::string::npos) ? s.substr(0, slash) : s;
    path = (slash != std::string::npos) ? s.substr(slash) : "/";

    auto colon = hostport.find(':');
    if (colon != std::string::npos) {
        host = hostport.substr(0, colon);
        try { port = std::stoi(hostport.substr(colon + 1)); }
        catch (...) { port = 80; }
    } else {
        host = hostport;
        port = 80;
    }
    return !host.empty();
}

// Bangun JSON payload dari CBlock
static std::string BuildPayload(const CBlock& block)
{
    std::ostringstream j;
    j << "{";
    j << "\"hash\":\""       << block.GetHash().GetHex()          << "\"";
    j << ",\"version\":"     << block.nVersion;
    j << ",\"prevHash\":\""  << block.hashPrevBlock.GetHex()       << "\"";
    j << ",\"merkleRoot\":\"" << block.hashMerkleRoot.GetHex()     << "\"";
    j << ",\"timestamp\":"   << block.nTime;
    j << ",\"bits\":"        << block.nBits;
    j << ",\"nonce\":"       << block.nNonce;
    j << ",\"txCount\":"     << block.vtx.size();

    // Kirim maks 20 txid untuk menjaga payload kecil
    j << ",\"txids\":[";
    size_t n = std::min(block.vtx.size(), (size_t)20);
    for (size_t i = 0; i < n; i++) {
        if (i) j << ",";
        j << "\"" << block.vtx[i]->GetId().GetHex() << "\"";
    }
    j << "]}";
    return j.str();
}

// Minimal JSON parser untuk ambil nilai numerik dan string
static double ParseDouble(const std::string& json, const std::string& key, double def)
{
    auto pos = json.find("\"" + key + "\"");
    if (pos == std::string::npos) return def;
    pos = json.find(':', pos);
    if (pos == std::string::npos) return def;
    pos++;
    while (pos < json.size() && (json[pos] == ' ' || json[pos] == '\t')) pos++;
    try {
        size_t used = 0;
        double v = std::stod(json.substr(pos), &used);
        return (used > 0) ? v : def;
    } catch (...) { return def; }
}

static std::string ParseString(const std::string& json, const std::string& key,
                               const std::string& def)
{
    auto pos = json.find("\"" + key + "\"");
    if (pos == std::string::npos) return def;
    pos = json.find('"', json.find(':', pos) + 1);
    if (pos == std::string::npos) return def;
    auto end = json.find('"', pos + 1);
    if (end == std::string::npos) return def;
    return json.substr(pos + 1, end - pos - 1);
}

// HTTP POST via POSIX socket (non-blocking connect + select)
static bool HTTPPost(const std::string& host, int port,
                     const std::string& path, const std::string& body,
                     int timeoutMs, std::string& responseBody)
{
    // Resolve
    struct addrinfo hints{}, *res = nullptr;
    hints.ai_family   = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    if (getaddrinfo(host.c_str(), std::to_string(port).c_str(), &hints, &res) != 0 || !res)
        return false;

    // Create non-blocking socket
    int fd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
    if (fd < 0) { freeaddrinfo(res); return false; }

    int fl = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, fl | O_NONBLOCK);

    // Connect (non-blocking)
    connect(fd, res->ai_addr, res->ai_addrlen);
    freeaddrinfo(res);

    // Wait for writable (= connected or failed)
    fd_set ws; FD_ZERO(&ws); FD_SET(fd, &ws);
    struct timeval tv{ timeoutMs / 1000, (timeoutMs % 1000) * 1000 };
    if (select(fd + 1, nullptr, &ws, nullptr, &tv) <= 0) { close(fd); return false; }

    int soErr = 0; socklen_t soLen = sizeof(soErr);
    getsockopt(fd, SOL_SOCKET, SO_ERROR, &soErr, &soLen);
    if (soErr != 0) { close(fd); return false; }

    // Restore blocking
    fcntl(fd, F_SETFL, fl);

    // Send HTTP request
    std::ostringstream req;
    req << "POST " << path << " HTTP/1.0\r\n"
        << "Host: " << host << ":" << port << "\r\n"
        << "Content-Type: application/json\r\n"
        << "Content-Length: " << body.size() << "\r\n"
        << "Connection: close\r\n"
        << "\r\n" << body;

    std::string reqStr = req.str();
    if (send(fd, reqStr.c_str(), reqStr.size(), MSG_NOSIGNAL) < 0) {
        close(fd); return false;
    }

    // Read response (with remaining timeout)
    std::string raw;
    char buf[4096];
    while (true) {
        fd_set rs; FD_ZERO(&rs); FD_SET(fd, &rs);
        struct timeval rtv{ timeoutMs / 1000, (timeoutMs % 1000) * 1000 };
        if (select(fd + 1, &rs, nullptr, nullptr, &rtv) <= 0) break;
        ssize_t n = recv(fd, buf, sizeof(buf) - 1, 0);
        if (n <= 0) break;
        buf[n] = '\0';
        raw += buf;
    }
    close(fd);

    if (raw.empty()) return false;

    // Strip HTTP headers
    auto sep = raw.find("\r\n\r\n");
    if (sep != std::string::npos) { responseBody = raw.substr(sep + 4); return true; }
    sep = raw.find("\n\n");
    if (sep != std::string::npos) { responseBody = raw.substr(sep + 2); return true; }
    return false;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC: CallAIValidator
// ─────────────────────────────────────────────────────────────
AIResult CallAIValidator(const CBlock& block)
{
    AIResult result;

    try {
        std::string blockHash = block.GetHash().GetHex();

        // Deduplikasi: jika block ini sudah divalidasi, kembalikan hasil cache
        {
            std::lock_guard<std::mutex> lk(s_lastMutex);
            if (s_lastHash == blockHash && s_lastResult.success) {
                return s_lastResult;
            }
        }

        std::string endpoint = GetEndpoint();
        int         timeout  = GetTimeoutMs();

        std::string host, path;
        int port = 80;
        if (!ParseURL(endpoint, host, port, path)) {
            LogPrintf("[AI-Connector] Invalid endpoint '%s' — skipping\n", endpoint);
            return result;
        }

        std::string payload  = BuildPayload(block);

        // ── TIMING ───────────────────────────────────────────
        auto t0 = std::chrono::steady_clock::now();

        std::string responseBody;
        bool ok = HTTPPost(host, port, path, payload, timeout, responseBody);

        auto t1  = std::chrono::steady_clock::now();
        int64_t ms = std::chrono::duration_cast<std::chrono::milliseconds>(t1 - t0).count();
        result.responseTimeMs = ms;

        if (!ok || responseBody.empty()) {
            result.success  = false;
            result.errorMsg = "timeout or connection refused";
            s_available.store(false);
            LogPrintf("[AI-Connector] block=%.16s — AI unavailable (%dms)\n",
                      blockHash, (int)ms);
            return result;
        }

        s_available.store(true);

        // ── PARSE RESPONSE ────────────────────────────────────
        double score = ParseDouble(responseBody, "score", 1.0);
        std::string risk     = ParseString(responseBody, "risk",     "low");
        std::string decision = ParseString(responseBody, "decision", "approve");

        // Clamp score
        if (score < 0.0) score = 0.0;
        if (score > 1.0) score = 1.0;

        result.score    = score;
        result.risk     = risk;
        result.decision = decision;
        result.success  = true;

        // ── CACHE RESULT ──────────────────────────────────────
        {
            std::lock_guard<std::mutex> lk(s_lastMutex);
            s_lastHash   = blockHash;
            s_lastResult = result;
        }

        LogPrintf("[AI-Connector] block=%.16s score=%.4f risk=%s decision=%s time=%dms\n",
                  blockHash, score, risk, decision, (int)ms);

    } catch (const std::exception& e) {
        result.success  = false;
        result.errorMsg = e.what();
        LogPrintf("[AI-Connector] Exception: %s — proceeding normally\n", e.what());
    } catch (...) {
        result.success  = false;
        result.errorMsg = "unknown exception";
        LogPrintf("[AI-Connector] Unknown exception — proceeding normally\n");
    }

    return result;
}

// ─────────────────────────────────────────────────────────────
// PUBLIC: InitAIConnector
// ─────────────────────────────────────────────────────────────
void InitAIConnector(const std::string& endpoint, int timeoutMs)
{
    std::lock_guard<std::mutex> lk(s_configMutex);

    if (!endpoint.empty()) s_endpoint  = endpoint;
    if (timeoutMs > 0)     s_timeoutMs = std::min(timeoutMs, MAX_TIMEOUT_MS);

    // Baca dari gArgs sebagai fallback
    std::string ep  = s_endpoint.empty()
                      ? gArgs.GetArg("-aivalidator_endpoint", DEFAULT_ENDPOINT)
                      : s_endpoint;
    int         tms = (s_timeoutMs > 0)
                      ? s_timeoutMs
                      : (int)gArgs.GetArg("-aivalidator_timeout", (int64_t)DEFAULT_TIMEOUT_MS);

    LogPrintf("[AI-Connector] Initialized — endpoint=%s timeout=%dms"
              " advisory=%s strict=%s\n",
              ep, tms,
              gArgs.GetBoolArg("-ai_advisory_mode", true) ? "ON" : "OFF",
              gArgs.GetBoolArg("-ai_strict_mode",   false) ? "ON" : "OFF");
}

// ─────────────────────────────────────────────────────────────
// PUBLIC: IsAIConnectorAvailable
// ─────────────────────────────────────────────────────────────
bool IsAIConnectorAvailable()
{
    return s_available.load();
}
