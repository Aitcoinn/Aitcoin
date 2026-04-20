// Copyright (c) 2024 The AITCOIN developers
// Distributed under the MIT software license.
//
// CRYSTALS-Dilithium — Post-Quantum Digital Signature
// NIST FIPS 204 standard (ML-DSA-65 = Dilithium3)
//
// Security level: Category 3 (≥ 128-bit post-quantum security)
// Based on Module Learning With Errors (MLWE) hardness assumption.
// Resistant to Shor's algorithm attacks on quantum computers.

#ifndef IXC_CRYPTO_DILITHIUM_H
#define IXC_CRYPTO_DILITHIUM_H

#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <array>
#include <vector>

// ── Dilithium3 (ML-DSA-65) Parameter Set ────────────────────────────────────
namespace Dilithium3 {

// Ring dimension
constexpr int N   = 256;
// Modulus q = 2^23 − 2^13 + 1
constexpr int Q   = 8380417;
// Module rank
constexpr int K   = 6;
constexpr int L   = 5;
// Drop bits from t
constexpr int D   = 13;
// Collision strength of c~
constexpr int TAU = 49;
// Hint bound
constexpr int OMEGA = 55;
// y coefficient bound
constexpr int GAMMA1 = (1 << 19);
// Low-order rounding range
constexpr int GAMMA2 = (Q - 1) / 32;

// Key sizes (bytes)
constexpr size_t SEEDBYTES    = 32;
constexpr size_t CRHBYTES     = 64;
constexpr size_t TRBYTES      = 64;
constexpr size_t POLYT1_PACKEDBYTES  = 320;
constexpr size_t POLYT0_PACKEDBYTES  = 416;
constexpr size_t POLYVECL_PACKEDBYTES = L * 640;

constexpr size_t PUBLICKEY_SIZE = SEEDBYTES + K * POLYT1_PACKEDBYTES; // 1952 bytes
constexpr size_t SECRETKEY_SIZE = 2*SEEDBYTES + TRBYTES
                                 + L*32 + K*32
                                 + K*POLYT0_PACKEDBYTES;               // 4032 bytes
constexpr size_t SIGNATURE_SIZE = CRHBYTES + L * 640 + OMEGA + K;     // 3309 bytes

// A polynomial in Z_q[x]/(x^N + 1)
struct Poly {
    int32_t coeffs[N];
    void zero() { memset(coeffs, 0, sizeof(coeffs)); }
};

// Vector of K or L polynomials
template<int DIM>
struct PolyVec {
    Poly vec[DIM];
    void zero() { for (auto &p : vec) p.zero(); }
};

using PolyVecK = PolyVec<K>;
using PolyVecL = PolyVec<L>;

// Key structures
struct PublicKey {
    uint8_t rho[SEEDBYTES];          // seed for matrix A
    uint8_t t1[K][POLYT1_PACKEDBYTES]; // packed high bits of t
    uint8_t bytes[PUBLICKEY_SIZE];   // serialized form

    void serialize(uint8_t out[PUBLICKEY_SIZE]) const;
    bool deserialize(const uint8_t in[PUBLICKEY_SIZE]);
};

struct SecretKey {
    uint8_t rho[SEEDBYTES];          // seed for matrix A
    uint8_t key[SEEDBYTES];          // signing key
    uint8_t tr[TRBYTES];             // hash of public key
    PolyVecL s1;                     // secret vector s1
    PolyVecK s2;                     // secret vector s2
    PolyVecK t0;                     // low bits of t

    void clear() {
        memset(rho, 0, sizeof(rho));
        memset(key, 0, sizeof(key));
        memset(tr,  0, sizeof(tr));
        s1.zero();
        s2.zero();
        t0.zero();
    }
};

struct Signature {
    uint8_t c_tilde[CRHBYTES];        // commitment hash
    PolyVecL z;                        // response vector
    PolyVecK h;                        // hints

    void serialize(uint8_t out[SIGNATURE_SIZE]) const;
    bool deserialize(const uint8_t in[SIGNATURE_SIZE]);
};

// ── Core operations (implemented in dilithium.cpp) ───────────────────────────

/**
 * Generate a Dilithium3 key pair.
 * @param pk  Output public key
 * @param sk  Output secret key
 * @param seed 32-byte random seed (use GetRandBytes in production)
 */
void KeyGen(PublicKey &pk, SecretKey &sk, const uint8_t seed[SEEDBYTES]);

/**
 * Sign a message using Dilithium3.
 * @param sig     Output signature
 * @param msg     Message buffer
 * @param msglen  Message length
 * @param sk      Secret key
 */
void Sign(Signature &sig, const uint8_t *msg, size_t msglen,
          const SecretKey &sk);

/**
 * Verify a Dilithium3 signature.
 * @return true if valid
 */
bool Verify(const Signature &sig, const uint8_t *msg, size_t msglen,
            const PublicKey &pk);

/**
 * Convenience wrappers for byte-array interface
 */
bool SignBytes(const uint8_t *sk_bytes, size_t sk_len,
               const uint8_t *msg, size_t msg_len,
               uint8_t sig_out[SIGNATURE_SIZE]);

bool VerifyBytes(const uint8_t *pk_bytes, size_t pk_len,
                 const uint8_t *msg, size_t msg_len,
                 const uint8_t *sig_bytes, size_t sig_len);

} // namespace Dilithium3

// ── Convenience type aliases for AITCOIN integration ─────────────────────────

using PQPublicKey  = std::array<uint8_t, Dilithium3::PUBLICKEY_SIZE>;
using PQSecretKey  = std::array<uint8_t, Dilithium3::SECRETKEY_SIZE>;
using PQSignature  = std::array<uint8_t, Dilithium3::SIGNATURE_SIZE>;

#endif // IXC_CRYPTO_DILITHIUM_H
