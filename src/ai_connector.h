// Copyright (c) 2021-2024 The AITCOIN developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

#ifndef IXC_AI_CONNECTOR_H
#define IXC_AI_CONNECTOR_H

// ============================================================
// AI_CONNECTOR.H — Protocol-Level AI Validator Connector
//
// ARSITEKTUR:
//   Core Blockchain (C++)
//       ↕  HTTP POST (max 200ms)
//   AI Validator (Node.js)  →  http://127.0.0.1:3000/ai/validate
//
// PRINSIP UTAMA:
//   1. Blockchain tetap hakim utama — PoW tidak berubah
//   2. AI memberi pengaruh NYATA melalui CLI flags:
//        -ai_advisory_mode (default true): log warning jika skor rendah
//        -ai_strict_mode   (default false): reject block jika skor < 0.3
//   3. Jika AI tidak merespon → block diproses normal (failsafe)
//   4. Maksimal 1 request per block, non-blocking terhadap mining
// ============================================================

#include "primitives/block.h"

#include <cstdint>
#include <string>

// ── RESULT STRUCT ─────────────────────────────────────────────
// Dikembalikan oleh CallAIValidator untuk setiap block
struct AIResult {
    double      score;          // 0.0 – 1.0  (1.0 = sangat aman)
    std::string risk;           // "low" | "medium" | "high" | "critical"
    std::string decision;       // "approve" | "warn" | "reject"
    bool        success;        // false jika AI tidak merespon / timeout
    int64_t     responseTimeMs; // Waktu respons dalam milidetik
    std::string errorMsg;       // Pesan error jika success = false

    AIResult()
        : score(1.0), risk("low"), decision("approve"),
          success(false), responseTimeMs(0) {}
};

// ── PUBLIC API ────────────────────────────────────────────────

/**
 * CallAIValidator
 *
 * Kirim data block ke AI layer via HTTP POST dan kembalikan hasil evaluasi.
 *
 * - Jika AI tidak merespon dalam timeout → result.success = false
 * - TIDAK pernah throw exception
 * - Thread-safe (bisa dipanggil dari validation thread manapun)
 *
 * CLI flags yang dibaca (via gArgs):
 *   -aivalidator_endpoint  (string, default: http://127.0.0.1:3000/ai/validate)
 *   -aivalidator_timeout   (int,    default: 200ms, max: 500ms)
 *
 * Catatan: Keputusan reject/warn dibuat di validation.cpp oleh pemanggil,
 *          bukan di sini. Fungsi ini hanya mengambil skor dari AI.
 */
AIResult CallAIValidator(const CBlock& block);

/**
 * InitAIConnector
 *
 * Opsional: Inisialisasi manual (biasanya dipanggil dari init.cpp).
 * Jika tidak dipanggil, konfigurasi default digunakan.
 */
void InitAIConnector(
    const std::string& endpoint = "",   // kosong = gunakan default/gArgs
    int timeoutMs = 0                   // 0 = gunakan default (200ms)
);

/**
 * IsAIConnectorAvailable
 *
 * Return true jika AI layer berhasil dihubungi pada request terakhir.
 * Berguna untuk health check dan monitoring.
 */
bool IsAIConnectorAvailable();

#endif // IXC_AI_CONNECTOR_H
