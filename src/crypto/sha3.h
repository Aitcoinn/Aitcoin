// Copyright (c) 2024 The AITCOIN developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.
//
// SHA-3 (Keccak-256) implementation — Quantum-Resistant Hash Primitive
// NIST FIPS 202 compliant. Grover's algorithm provides only sqrt speedup
// on hash functions, so SHA3-256 gives 128-bit post-quantum security.

#ifndef IXC_CRYPTO_SHA3_H
#define IXC_CRYPTO_SHA3_H

#include <cstdint>
#include <cstdlib>
#include <cstring>

/**
 * SHA3-256 (Keccak-f[1600]) hasher.
 *
 * Post-quantum security: 128 bits (Grover halves classical 256-bit → 128-bit
 * effective, still considered secure per NIST PQC guidelines).
 *
 * Replaces double-SHA256 (CHash256) for address derivation and transaction
 * hashing in quantum-resistant mode.
 */
class CSHA3_256 {
public:
    static const size_t OUTPUT_SIZE = 32; // 256 bits

    CSHA3_256();
    CSHA3_256 &Write(const uint8_t *data, size_t len);
    void Finalize(uint8_t hash[OUTPUT_SIZE]);
    CSHA3_256 &Reset();

private:
    // Keccak-f[1600] state: 25 lanes of 64 bits
    uint64_t m_state[25];
    uint8_t  m_buf[136];   // rate = 1088 bits = 136 bytes for SHA3-256
    size_t   m_buf_len;
    bool     m_finalized;

    static const size_t RATE = 136; // (1600 - 2*256) / 8 bytes
    static const uint8_t DOMAIN_PAD = 0x06; // SHA-3 domain separation

    void KeccakF1600();
    void Absorb(const uint8_t *data, size_t len);
};

/**
 * SHA3-512 hasher — 256-bit post-quantum security.
 * Used for key derivation and HMAC in quantum-resistant mode.
 */
class CSHA3_512 {
public:
    static const size_t OUTPUT_SIZE = 64;

    CSHA3_512();
    CSHA3_512 &Write(const uint8_t *data, size_t len);
    void Finalize(uint8_t hash[OUTPUT_SIZE]);
    CSHA3_512 &Reset();

private:
    uint64_t m_state[25];
    uint8_t  m_buf[72];    // rate = 576 bits = 72 bytes for SHA3-512
    size_t   m_buf_len;
    bool     m_finalized;

    static const size_t RATE = 72;
    static const uint8_t DOMAIN_PAD = 0x06;

    void KeccakF1600();
    void Absorb(const uint8_t *data, size_t len);
};

/**
 * SHAKE256 extendable output function.
 * Used internally by CRYSTALS-Dilithium for key expansion.
 * Provides variable-length output with 256-bit post-quantum security.
 */
class CSHAKE256 {
public:
    CSHAKE256();
    CSHAKE256 &Write(const uint8_t *data, size_t len);
    void Finalize(uint8_t *out, size_t outlen);
    CSHAKE256 &Reset();

private:
    uint64_t m_state[25];
    uint8_t  m_buf[136];   // rate = 136 bytes for SHAKE256
    size_t   m_buf_len;
    bool     m_squeezing;

    static const size_t RATE = 136;
    static const uint8_t DOMAIN_PAD = 0x1F; // SHAKE domain separation

    void KeccakF1600();
};

#endif // IXC_CRYPTO_SHA3_H
