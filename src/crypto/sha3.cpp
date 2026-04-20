// Copyright (c) 2024 The AITCOIN developers
// Distributed under the MIT software license.
// SHA-3 / Keccak-f[1600] — NIST FIPS 202

#include "sha3.h"
#include <cassert>

// Keccak round constants
static const uint64_t RC[24] = {
    0x0000000000000001ULL, 0x0000000000008082ULL, 0x800000000000808AULL,
    0x8000000080008000ULL, 0x000000000000808BULL, 0x0000000080000001ULL,
    0x8000000080008081ULL, 0x8000000000008009ULL, 0x000000000000008AULL,
    0x0000000000000088ULL, 0x0000000080008009ULL, 0x000000008000000AULL,
    0x000000008000808BULL, 0x800000000000008BULL, 0x8000000000008089ULL,
    0x8000000000008003ULL, 0x8000000000008002ULL, 0x8000000000000080ULL,
    0x000000000000800AULL, 0x800000008000000AULL, 0x8000000080008081ULL,
    0x8000000000008080ULL, 0x0000000080000001ULL, 0x8000000080008008ULL,
};

// Rotation offsets (Keccak FIPS 202 Table 2)
static const int ROT[24] = {
     1,  3,  6, 10, 15, 21, 28, 36, 45, 55,  2, 14,
    27, 41, 56,  8, 25, 43, 62, 18, 39, 61, 20, 44,
};

// Lane index permutation for rho/pi steps
static const int PI[24] = {
    10,  7, 11, 17, 18, 3,  5, 16,  8, 21, 24,  4,
    15, 23, 19, 13, 12,  2, 20, 14, 22,  9,  6,  1,
};

static inline uint64_t ROL64(uint64_t x, int n) {
    return (x << n) | (x >> (64 - n));
}

static inline uint64_t LE64(const uint8_t *p) {
    return (uint64_t)p[0]       | ((uint64_t)p[1] << 8)  |
           ((uint64_t)p[2]<<16) | ((uint64_t)p[3] << 24) |
           ((uint64_t)p[4]<<32) | ((uint64_t)p[5] << 40) |
           ((uint64_t)p[6]<<48) | ((uint64_t)p[7] << 56);
}

static inline void ST64(uint8_t *p, uint64_t v) {
    for (int i = 0; i < 8; ++i) { p[i] = (uint8_t)(v >> (8*i)); }
}

// Keccak-f[1600] permutation — 24 rounds
static void KeccakF(uint64_t s[25]) {
    for (int round = 0; round < 24; ++round) {
        // θ step
        uint64_t C[5], D[5];
        for (int x = 0; x < 5; ++x)
            C[x] = s[x] ^ s[x+5] ^ s[x+10] ^ s[x+15] ^ s[x+20];
        for (int x = 0; x < 5; ++x)
            D[x] = C[(x+4)%5] ^ ROL64(C[(x+1)%5], 1);
        for (int i = 0; i < 25; ++i)
            s[i] ^= D[i%5];

        // ρ and π steps
        uint64_t last = s[1];
        for (int i = 0; i < 24; ++i) {
            int j = PI[i];
            uint64_t tmp = s[j];
            s[j] = ROL64(last, ROT[i]);
            last = tmp;
        }

        // χ step
        for (int y = 0; y < 25; y += 5) {
            uint64_t t[5];
            for (int x = 0; x < 5; ++x) t[x] = s[y+x];
            for (int x = 0; x < 5; ++x)
                s[y+x] = t[x] ^ (~t[(x+1)%5] & t[(x+2)%5]);
        }

        // ι step
        s[0] ^= RC[round];
    }
}

// ---- CSHA3_256 ----

CSHA3_256::CSHA3_256() { Reset(); }

CSHA3_256 &CSHA3_256::Reset() {
    memset(m_state, 0, sizeof(m_state));
    memset(m_buf, 0, sizeof(m_buf));
    m_buf_len = 0;
    m_finalized = false;
    return *this;
}

void CSHA3_256::KeccakF1600() { KeccakF(m_state); }

void CSHA3_256::Absorb(const uint8_t *data, size_t len) {
    while (len > 0) {
        size_t take = RATE - m_buf_len;
        if (take > len) take = len;
        memcpy(m_buf + m_buf_len, data, take);
        m_buf_len += take;
        data += take;
        len  -= take;

        if (m_buf_len == RATE) {
            // XOR block into state lanes
            for (size_t i = 0; i < RATE / 8; ++i)
                m_state[i] ^= LE64(m_buf + i*8);
            KeccakF1600();
            m_buf_len = 0;
        }
    }
}

CSHA3_256 &CSHA3_256::Write(const uint8_t *data, size_t len) {
    assert(!m_finalized);
    Absorb(data, len);
    return *this;
}

void CSHA3_256::Finalize(uint8_t hash[OUTPUT_SIZE]) {
    assert(!m_finalized);
    // Padding: SHA-3 domain 0x06, then 0x80 at end of block
    memset(m_buf + m_buf_len, 0, RATE - m_buf_len);
    m_buf[m_buf_len]   ^= DOMAIN_PAD;
    m_buf[RATE - 1]    ^= 0x80;
    for (size_t i = 0; i < RATE / 8; ++i)
        m_state[i] ^= LE64(m_buf + i*8);
    KeccakF1600();
    // Squeeze 32 bytes
    for (int i = 0; i < 4; ++i)
        ST64(hash + i*8, m_state[i]);
    m_finalized = true;
}

// ---- CSHA3_512 ----

CSHA3_512::CSHA3_512() { Reset(); }

CSHA3_512 &CSHA3_512::Reset() {
    memset(m_state, 0, sizeof(m_state));
    memset(m_buf, 0, sizeof(m_buf));
    m_buf_len = 0;
    m_finalized = false;
    return *this;
}

void CSHA3_512::KeccakF1600() { KeccakF(m_state); }

void CSHA3_512::Absorb(const uint8_t *data, size_t len) {
    while (len > 0) {
        size_t take = RATE - m_buf_len;
        if (take > len) take = len;
        memcpy(m_buf + m_buf_len, data, take);
        m_buf_len += take;
        data += take;
        len  -= take;
        if (m_buf_len == RATE) {
            for (size_t i = 0; i < RATE / 8; ++i)
                m_state[i] ^= LE64(m_buf + i*8);
            KeccakF1600();
            m_buf_len = 0;
        }
    }
}

CSHA3_512 &CSHA3_512::Write(const uint8_t *data, size_t len) {
    assert(!m_finalized);
    Absorb(data, len);
    return *this;
}

void CSHA3_512::Finalize(uint8_t hash[OUTPUT_SIZE]) {
    assert(!m_finalized);
    memset(m_buf + m_buf_len, 0, RATE - m_buf_len);
    m_buf[m_buf_len] ^= DOMAIN_PAD;
    m_buf[RATE - 1]  ^= 0x80;
    for (size_t i = 0; i < RATE / 8; ++i)
        m_state[i] ^= LE64(m_buf + i*8);
    KeccakF1600();
    for (int i = 0; i < 8; ++i)
        ST64(hash + i*8, m_state[i]);
    m_finalized = true;
}

// ---- CSHAKE256 ----

CSHAKE256::CSHAKE256() { Reset(); }

CSHAKE256 &CSHAKE256::Reset() {
    memset(m_state, 0, sizeof(m_state));
    memset(m_buf, 0, sizeof(m_buf));
    m_buf_len = 0;
    m_squeezing = false;
    return *this;
}

void CSHAKE256::KeccakF1600() { KeccakF(m_state); }

CSHAKE256 &CSHAKE256::Write(const uint8_t *data, size_t len) {
    assert(!m_squeezing);
    while (len > 0) {
        size_t take = RATE - m_buf_len;
        if (take > len) take = len;
        memcpy(m_buf + m_buf_len, data, take);
        m_buf_len += take;
        data += take;
        len  -= take;
        if (m_buf_len == RATE) {
            for (size_t i = 0; i < RATE / 8; ++i)
                m_state[i] ^= LE64(m_buf + i*8);
            KeccakF1600();
            m_buf_len = 0;
        }
    }
    return *this;
}

void CSHAKE256::Finalize(uint8_t *out, size_t outlen) {
    if (!m_squeezing) {
        memset(m_buf + m_buf_len, 0, RATE - m_buf_len);
        m_buf[m_buf_len] ^= DOMAIN_PAD;
        m_buf[RATE - 1]  ^= 0x80;
        for (size_t i = 0; i < RATE / 8; ++i)
            m_state[i] ^= LE64(m_buf + i*8);
        KeccakF1600();
        m_squeezing = true;
        m_buf_len = 0;
    }
    // Squeeze output
    size_t off = 0;
    while (off < outlen) {
        if (m_buf_len == 0) {
            // Fill squeeze buffer from state
            for (size_t i = 0; i < RATE / 8; ++i)
                ST64(m_buf + i*8, m_state[i]);
            KeccakF1600();
        }
        size_t take = RATE - m_buf_len;
        if (take > outlen - off) take = outlen - off;
        memcpy(out + off, m_buf + m_buf_len, take);
        m_buf_len += take;
        off += take;
        if (m_buf_len == RATE) m_buf_len = 0;
    }
}
