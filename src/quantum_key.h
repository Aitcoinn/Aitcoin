// Copyright (c) 2024 The AITCOIN developers
// Distributed under the MIT software license.
//
// Quantum-Resistant Key Management for AITCOIN
// ============================================
// Implements a HYBRID key system that combines:
//   - Legacy:  secp256k1 (ECDSA) — kept for backward compatibility
//   - Quantum: CRYSTALS-Dilithium3 (ML-DSA-65) — NIST FIPS 204
//
// Addresses derived using SHA3-256 instead of RIPEMD160(SHA256(pubkey))
// giving 128-bit post-quantum security on address collision resistance.
//
// Migration path:
//   Phase 1 (now): Both signature types accepted; PQ keys preferred.
//   Phase 2: Only PQ signatures valid (hard fork at block PQ_ACTIVATE_HEIGHT).
//   Phase 3: Legacy key infrastructure removed.

#ifndef IXC_QUANTUM_KEY_H
#define IXC_QUANTUM_KEY_H

#include "crypto/dilithium.h"
#include "crypto/sha3.h"
#include "uint256.h"
#include "support/allocators/secure.h"

#include <array>
#include <cstdint>
#include <vector>
#include <string>

// Block height at which PQ-only consensus is enforced
static constexpr uint32_t PQ_ACTIVATE_HEIGHT = 100000;

// Key type tag stored in serialized keys and addresses
enum class KeyAlgo : uint8_t {
    ECDSA_SECP256K1  = 0x00,  // Legacy — NOT quantum safe
    DILITHIUM3       = 0x01,  // NIST ML-DSA-65 — quantum resistant
    HYBRID           = 0x02,  // Both ECDSA + Dilithium3 signatures
};

// ── Dilithium3 Address ────────────────────────────────────────────────────────
// Address = SHA3-256(0x01 || DilithiumPublicKey)[0..19]
// 20-byte address prefix (same size as legacy, for script compat)
struct PQAddress {
    static constexpr size_t SIZE = 20;
    uint8_t data[SIZE];

    bool operator==(const PQAddress &o) const {
        return memcmp(data, o.data, SIZE) == 0;
    }
    bool operator!=(const PQAddress &o) const { return !(*this == o); }

    std::string ToHex() const;
};

// ── Quantum-Resistant Private Key ─────────────────────────────────────────────
class CQuantumKey {
public:
    CQuantumKey();
    ~CQuantumKey() { SecureZeroMemory(); }

    // Generate a new Dilithium3 key pair from secure random seed
    void MakeNewKey();

    // Initialize from a 32-byte seed (deterministic)
    void SetSeed(const uint8_t seed[32]);

    // Return the public key bytes (1952 bytes for Dilithium3)
    PQPublicKey GetPubKey() const;

    // Sign a 32-byte message hash; returns signature (3309 bytes)
    bool Sign(const uint256 &hash, PQSignature &sig) const;

    // Sign arbitrary message
    bool SignMessage(const uint8_t *msg, size_t len, PQSignature &sig) const;

    // Check if this key is valid
    bool IsValid() const { return m_valid; }

    // Wipe key material from memory
    void SecureZeroMemory();

    // Derive Dilithium3 address from this key
    PQAddress GetAddress() const;

private:
    bool m_valid;
    std::vector<uint8_t, secure_allocator<uint8_t>> m_sk_bytes;
    PQPublicKey m_pk;

    static PQAddress DeriveAddress(const PQPublicKey &pk);
};

// ── Quantum-Resistant Public Key ──────────────────────────────────────────────
class CQuantumPubKey {
public:
    static constexpr size_t SIZE = Dilithium3::PUBLICKEY_SIZE; // 1952 bytes

    CQuantumPubKey() : m_valid(false) {}
    CQuantumPubKey(const PQPublicKey &pk) : m_pk(pk), m_valid(true) {}

    // Verify a Dilithium3 signature
    bool Verify(const uint256 &hash, const PQSignature &sig) const;
    bool VerifyMessage(const uint8_t *msg, size_t len, const PQSignature &sig) const;

    bool IsValid() const { return m_valid; }
    const PQPublicKey &GetBytes() const { return m_pk; }
    PQAddress GetAddress() const;

    // Serialization
    std::vector<uint8_t> Serialize() const;
    bool Deserialize(const uint8_t *data, size_t len);

private:
    PQPublicKey m_pk;
    bool m_valid;
};

// ── Quantum-Safe Hashing Helpers ──────────────────────────────────────────────

/**
 * Hash256Q — SHA3-256 single pass (post-quantum address hashing)
 * Replaces Hash160 (RIPEMD160◦SHA256) for PQ key addresses.
 */
inline uint256 Hash256Q(const uint8_t *data, size_t len) {
    uint256 result;
    CSHA3_256().Write(data, len).Finalize(result.begin());
    return result;
}

/**
 * Hash512Q — SHA3-512 (for key derivation, BIP32-PQ equivalent)
 */
inline void Hash512Q(const uint8_t *data, size_t len, uint8_t out[64]) {
    CSHA3_512().Write(data, len).Finalize(out);
}

/**
 * Derive a 20-byte PQ address from a Dilithium3 public key.
 * Address = first 20 bytes of SHA3-256(0x01 || pubkey)
 */
PQAddress PQAddressFromPubKey(const PQPublicKey &pk);

/**
 * Verify a Dilithium3 signature over a 32-byte hash.
 * Convenience wrapper used in script evaluation.
 */
bool VerifyPQSignature(const PQPublicKey &pk, const uint256 &hash,
                       const PQSignature &sig);

// ── Script opcodes for PQ transactions ───────────────────────────────────────
// New opcodes added alongside existing OP_CHECKSIG
// OP_CHECKSIG_PQ    = 0xC1  — verify Dilithium3 signature
// OP_CHECKMULTISIG_PQ = 0xC2 — verify M-of-N Dilithium3 multisig
constexpr uint8_t OP_CHECKSIG_PQ      = 0xC1;
constexpr uint8_t OP_CHECKMULTISIG_PQ = 0xC2;

#endif // IXC_QUANTUM_KEY_H
