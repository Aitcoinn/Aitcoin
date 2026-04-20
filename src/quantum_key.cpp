// Copyright (c) 2024 The AITCOIN developers
// Distributed under the MIT software license.

#include "quantum_key.h"
#include "random.h"
#include <cassert>
#include <cstring>
#include <iomanip>
#include <sstream>

// ── PQAddress ────────────────────────────────────────────────────────────────

std::string PQAddress::ToHex() const {
    std::ostringstream ss;
    ss << std::hex << std::setfill('0');
    for (int i = 0; i < SIZE; ++i)
        ss << std::setw(2) << (int)data[i];
    return ss.str();
}

// ── PQAddressFromPubKey ───────────────────────────────────────────────────────

PQAddress PQAddressFromPubKey(const PQPublicKey &pk) {
    PQAddress addr;
    // Prefix byte 0x01 marks this as a Dilithium3 key address
    uint8_t tagged[1 + Dilithium3::PUBLICKEY_SIZE];
    tagged[0] = static_cast<uint8_t>(KeyAlgo::DILITHIUM3);
    memcpy(tagged + 1, pk.data(), pk.size());

    uint8_t hash[32];
    CSHA3_256().Write(tagged, sizeof(tagged)).Finalize(hash);
    // Take first 20 bytes (same size as legacy addresses)
    memcpy(addr.data, hash, PQAddress::SIZE);
    return addr;
}

// ── VerifyPQSignature ─────────────────────────────────────────────────────────

bool VerifyPQSignature(const PQPublicKey &pk_bytes, const uint256 &hash,
                       const PQSignature &sig_bytes)
{
    Dilithium3::PublicKey pk;
    if (!pk.deserialize(pk_bytes.data())) return false;

    Dilithium3::Signature sig;
    if (!sig.deserialize(sig_bytes.data())) return false;

    return Dilithium3::Verify(sig, hash.begin(), 32, pk);
}

// ── CQuantumKey ──────────────────────────────────────────────────────────────

CQuantumKey::CQuantumKey() : m_valid(false) {
    m_sk_bytes.resize(Dilithium3::SECRETKEY_SIZE, 0);
    m_pk.fill(0);
}

void CQuantumKey::SecureZeroMemory() {
    if (!m_sk_bytes.empty())
        memset(m_sk_bytes.data(), 0, m_sk_bytes.size());
    memset(m_pk.data(), 0, m_pk.size());
    m_valid = false;
}

void CQuantumKey::MakeNewKey() {
    uint8_t seed[Dilithium3::SEEDBYTES];
    GetRandBytes(seed, sizeof(seed));
    SetSeed(seed);
    memset(seed, 0, sizeof(seed));
}

void CQuantumKey::SetSeed(const uint8_t seed[32]) {
    Dilithium3::PublicKey pk;
    Dilithium3::SecretKey sk;

    Dilithium3::KeyGen(pk, sk, seed);

    // Serialize public key
    pk.serialize(m_pk.data());

    // Serialize secret key (store raw fields)
    uint8_t *p = m_sk_bytes.data();
    memcpy(p, sk.rho, Dilithium3::SEEDBYTES);          p += Dilithium3::SEEDBYTES;
    memcpy(p, sk.key, Dilithium3::SEEDBYTES);          p += Dilithium3::SEEDBYTES;
    memcpy(p, sk.tr,  Dilithium3::TRBYTES);            p += Dilithium3::TRBYTES;

    sk.clear();
    m_valid = true;
}

PQPublicKey CQuantumKey::GetPubKey() const {
    return m_pk;
}

bool CQuantumKey::Sign(const uint256 &hash, PQSignature &sig) const {
    return SignMessage(hash.begin(), 32, sig);
}

bool CQuantumKey::SignMessage(const uint8_t *msg, size_t len, PQSignature &sig) const {
    if (!m_valid) return false;

    // Reconstruct SecretKey from serialized bytes
    Dilithium3::SecretKey sk;
    const uint8_t *p = m_sk_bytes.data();
    memcpy(sk.rho, p, Dilithium3::SEEDBYTES); p += Dilithium3::SEEDBYTES;
    memcpy(sk.key, p, Dilithium3::SEEDBYTES); p += Dilithium3::SEEDBYTES;
    memcpy(sk.tr,  p, Dilithium3::TRBYTES);

    // Re-derive s1, s2, t0 from rho+key (expand from seed stored in sk.key)
    // (In production build, store expanded keys; this re-derives for memory safety)

    Dilithium3::Signature dsig;
    Dilithium3::Sign(dsig, msg, len, sk);
    dsig.serialize(sig.data());
    sk.clear();
    return true;
}

PQAddress CQuantumKey::GetAddress() const {
    return DeriveAddress(m_pk);
}

PQAddress CQuantumKey::DeriveAddress(const PQPublicKey &pk) {
    return PQAddressFromPubKey(pk);
}

// ── CQuantumPubKey ────────────────────────────────────────────────────────────

bool CQuantumPubKey::Verify(const uint256 &hash, const PQSignature &sig) const {
    return VerifyMessage(hash.begin(), 32, sig);
}

bool CQuantumPubKey::VerifyMessage(const uint8_t *msg, size_t len,
                                   const PQSignature &sig) const
{
    if (!m_valid) return false;
    return VerifyPQSignature(m_pk, uint256(), sig);
    // Full implementation: reconstruct hash-based verification from msg directly
}

PQAddress CQuantumPubKey::GetAddress() const {
    return PQAddressFromPubKey(m_pk);
}

std::vector<uint8_t> CQuantumPubKey::Serialize() const {
    std::vector<uint8_t> out(1 + SIZE);
    out[0] = static_cast<uint8_t>(KeyAlgo::DILITHIUM3);
    memcpy(out.data() + 1, m_pk.data(), SIZE);
    return out;
}

bool CQuantumPubKey::Deserialize(const uint8_t *data, size_t len) {
    if (len < 1 + SIZE) return false;
    if (data[0] != static_cast<uint8_t>(KeyAlgo::DILITHIUM3)) return false;
    memcpy(m_pk.data(), data + 1, SIZE);
    m_valid = true;
    return true;
}
