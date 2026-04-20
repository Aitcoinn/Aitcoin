# AITCOIN Development Fund Wallet Guide

## Arsitektur: Local-First

```
┌─────────────────────────────────────────────────────────────┐
│                       WALLET SYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│  PERTAMA KALI (sekali saja):                                │
│    Server/DB → Daftar wallet → Simpan ke file lokal         │
│                                                             │
│  SELANJUTNYA (tanpa server):                                │
│    wallet_state/dev_wallet.json → Semua operasi             │
│                                                             │
│  OPSIONAL (tidak wajib):                                    │
│    AITCOIN RPC → Verifikasi alamat di blockchain            │
└─────────────────────────────────────────────────────────────┘
```

**Server hanya dibutuhkan di awal.** Setelah file `wallet_state/dev_wallet.json`
terbuat, semua operasi berjalan OFFLINE — status, jadwal, klaim.

---

## Wallet Info

| | |
|---|---|
| **Alamat** | `AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5` |
| **Total** | 4,000,000 ATC |
| **Bebas** | 100,000 ATC (langsung) |
| **Vesting** | 3,900,000 ATC (100K/bulan × 39 bulan) |
| **Network** | AITCOIN Mainnet |
| **Derivation** | m/44'/0'/0'/0/0 |

---

## CLI Commands (Tanpa Server)

```bash
cd ai-layer

# Init wallet (sekali saja — bisa offline)
pnpm wallet:init

# Lihat status
pnpm wallet:status

# Lihat jadwal 39 bulan
pnpm wallet:schedule

# Klaim 100K ATC bebas
pnpm wallet:claim:free

# Klaim vesting bulan ini
pnpm wallet:claim:vesting

# Verifikasi via blockchain (opsional)
AITCOIN_RPC_URL=http://127.0.0.1:8332 pnpm wallet verify
```

---

## API Endpoints (Local-First)

```bash
# Status — baca dari file lokal, bukan DB
GET /api/wallet/status/:address

# Jadwal vesting — dari file lokal
GET /api/wallet/schedule/:address

# Klaim bebas — tidak butuh DB
POST /api/wallet/claim/free

# Klaim vesting — tidak butuh DB
POST /api/wallet/claim/vesting
```

Semua response JSON menyertakan `"source": "local_file"` — 
artinya tidak ada koneksi server/DB saat proses.

---

## File Lokal

```
ai-layer/
└── wallet_state/
    └── dev_wallet.json    ← Semua data wallet tersimpan di sini
```

Backup file ini untuk keamanan.
