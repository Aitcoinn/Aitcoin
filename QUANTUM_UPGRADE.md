# AITCOIN — Post-Quantum Cryptography Upgrade

## Overview

This document describes the quantum-resistant cryptography layer added to AITCOIN
in the 2024 PQ Upgrade. The goal is to protect AITCOIN against future quantum
computer attacks, specifically **Shor's algorithm** (breaks ECDSA/RSA) and
**Grover's algorithm** (halves effective hash security).

---

## Threat Model

| Threat | Classical Attack | Quantum Attack | Mitigation |
|---|---|---|---|
| ECDSA private key recovery | 2^128 (infeasible) | O(n^(1/2)) via Shor's | **Replace with Dilithium3** |
| SHA-256 collision | 2^128 | 2^64 via Grover's | **Replace with SHA3-256** |
| secp256k1 discrete log | Infeasible | Solvable by quantum | **Replace with ML-DSA-65** |
| Address reuse privacy | N/A | N/A | Use fresh address per TX |

Timeline estimate: Cryptographically-relevant quantum computers (CRQC) capable
of breaking 256-bit elliptic curves are projected within 10–20 years. AITCOIN
upgrades now to ensure assets are safe before that horizon.

---

## Changes Made

### 1. SHA-3 / Keccak-f[1600] — `src/crypto/sha3.h` / `sha3.cpp`

Full NIST FIPS 202 compliant implementation:
- **`CSHA3_256`** — 256-bit output, 128-bit PQ security
- **`CSHA3_512`** — 512-bit output, 256-bit PQ security
- **`CSHAKE256`** — Extendable output, used internally by Dilithium3

No external dependencies — pure C++17, self-contained.

### 2. CRYSTALS-Dilithium3 — `src/crypto/dilithium.h` / `dilithium.cpp`

NIST FIPS 204 (ML-DSA-65) lattice-based signature scheme:

| Parameter | Value |
|---|---|
| Algorithm | Module Learning With Errors (MLWE) |
| Security Level | Category 3 (≥ 128-bit PQ security) |
| Public Key Size | 1,952 bytes |
| Secret Key Size | 4,032 bytes |
| Signature Size | 3,309 bytes |
| Key Generation | O(N log N) via NTT |

Key operations:
- `Dilithium3::KeyGen(pk, sk, seed)` — deterministic key generation
- `Dilithium3::Sign(sig, msg, len, sk)` — signing with rejection sampling
- `Dilithium3::Verify(sig, msg, len, pk)` — verification

### 3. Quantum Key Manager — `src/quantum_key.h` / `quantum_key.cpp`

Hybrid key system:
- `CQuantumKey` — Dilithium3 private key with secure memory allocation
- `CQuantumPubKey` — Dilithium3 public key with verification
- `PQAddress` — 20-byte address derived as `SHA3-256(0x01 || pubkey)[0..19]`
- `PQAddressFromPubKey()` — deterministic address derivation
- `VerifyPQSignature()` — script-level verification hook

New script opcodes:
- `OP_CHECKSIG_PQ (0xC1)` — verify Dilithium3 signature
- `OP_CHECKMULTISIG_PQ (0xC2)` — verify M-of-N Dilithium3 multisig

### 4. Updated `src/hash.h`

New quantum-resistant hash classes:
- `CHash256Q` — SHA3-256 single-pass (replaces double-SHA256 for PQ mode)
- `CHash160Q` — SHA3-256 truncated to 20 bytes (replaces RIPEMD160◦SHA256)
- `HashPQ<T>()` — template function for SHA3-256 hashing of serializable objects

### 5. AI Layer — `ai-layer/src/ai-layer/quantum_crypto.ts`

TypeScript module for the AI Life Layer using `@noble/post-quantum`:
- `generatePQKeyPair()` — Dilithium3 key generation
- `generateKEMKeyPair()` — Kyber-768 key encapsulation pair
- `pqSign(sk, msg)` — sign messages
- `pqVerify(pk, msg, sig)` — verify signatures
- `kemEncap(pk)` / `kemDecap(sk, ct)` — encrypted AI-to-AI channels
- `sha3Hash(data)` — SHA3-256 hashing

---

## Migration Plan

### Phase 1 — Soft Fork (Current)
- PQ keys and signatures valid alongside legacy ECDSA
- Wallets can generate both key types
- Activation block: `PQ_ACTIVATE_HEIGHT = 100_000`

### Phase 2 — Hard Fork
- New transactions MUST use PQ signatures
- Legacy ECDSA UTXOs can still be spent (backward compat)
- Miners enforce PQ rule from activation block

### Phase 3 — Full Migration
- ECDSA infrastructure removed from codebase
- All wallets must have migrated to Dilithium3 keys

---

## Build Instructions

### Option A: Standalone (bundled implementation)
```bash
# No external dependencies needed — SHA3 and Dilithium3 are included
./autogen.sh
./configure --disable-tests
make -j$(nproc)
```

### Option B: With liboqs (recommended for production)
```bash
# Install Open Quantum Safe library
sudo apt-get install -y cmake
git clone https://github.com/open-quantum-safe/liboqs.git
cd liboqs && mkdir build && cd build
cmake -DOQS_DIST_BUILD=ON .. && make -j$(nproc) && sudo make install
cd /path/to/aitcoin
./configure --with-liboqs --disable-tests
make -j$(nproc)
```

### AI Layer
```bash
cd ai-layer
pnpm install   # installs @noble/post-quantum and @noble/hashes
pnpm run dev
```

---

## Security Assumptions

| Component | Hardness Assumption | Quantum Security |
|---|---|---|
| Dilithium3 signatures | Module LWE | 128-bit (Category 3) |
| SHA3-256 hashing | Keccak sponge | 128-bit (Grover halves) |
| Kyber-768 KEM | Module LWE | 128-bit (Category 3) |

All three schemes are NIST-standardized (FIPS 203, 204, 202).

---

## References

- NIST FIPS 202 — SHA-3 Standard (Keccak)
- NIST FIPS 203 — ML-KEM Standard (Kyber)
- NIST FIPS 204 — ML-DSA Standard (Dilithium)
- Ducas et al., "CRYSTALS-Dilithium: A Lattice-Based Digital Signature Scheme"
- Avanzi et al., "CRYSTALS-Kyber: A CCA-Secure Module-Lattice-Based KEM"
