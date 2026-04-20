# AITCOIN — Development Fund Wallet (4,000,000 ATC)

## ⚠️ SANGAT RAHASIA — JANGAN PERNAH SHARE ATAU COMMIT KE GITHUB ⚠️

File ini hanya berisi PANDUAN. Seed phrase wallet TIDAK disimpan di sini.

---

## Struktur Vesting Development Fund

| Komponen | Jumlah | Status |
|----------|--------|--------|
| Langsung tersedia | 100,000 ATC | Bisa diklaim langsung setelah genesis |
| Dikunci (vesting) | 3,900,000 ATC | Dibuka 100,000 ATC per bulan |
| **Total** | **4,000,000 ATC** | |

## Jadwal Pelepasan Koin Vesting

- **Bulan 1**: 100,000 ATC dibuka
- **Bulan 2**: 100,000 ATC dibuka
- **...**
- **Bulan 39**: 100,000 ATC dibuka (SELESAI — semua 3.9M terklaim)

## Tipe Wallet

- **Standar**: BIP39 HD Wallet
- **Derivation Path**: `m/44'/0'/0'/0/0`
- **Network**: AITCOIN Mainnet

## Cara Setup Wallet

1. Install AITCOIN Core (dari hasil build C++ di `/src`)
2. Buka `aitcoin-qt` atau jalankan `aitcoind`
3. Import seed phrase via: `aitcoin-cli importmnemonic "SEED_PHRASE_ANDA"`
4. Atau gunakan `aitcoin-qt` → File → Import Wallet

## SIMPAN SEED PHRASE DI:
- Hardware wallet (Ledger, Trezor)
- Kertas fisik yang disimpan di tempat aman
- Password manager yang dienkripsi
- JANGAN di file komputer tanpa enkripsi
- JANGAN di cloud storage
- JANGAN di chat/email

## API Endpoints Wallet

```
POST /api/wallet/register     — Daftarkan wallet address
GET  /api/wallet/status/:addr — Lihat status alokasi
GET  /api/wallet/schedule/:addr — Lihat jadwal vesting lengkap
POST /api/wallet/claim/free   — Klaim 100K ATC gratis
POST /api/wallet/claim/vesting — Klaim vesting bulanan (100K/bulan)
```

## Contoh Klaim Vesting

```bash
# Daftarkan wallet
curl -X POST http://localhost:PORT/api/wallet/register \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"AITCOIN_ADDRESS_ANDA","label":"Development Fund"}'

# Lihat jadwal
curl http://localhost:PORT/api/wallet/schedule/AITCOIN_ADDRESS_ANDA

# Klaim koin bulan ini
curl -X POST http://localhost:PORT/api/wallet/claim/vesting \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"AITCOIN_ADDRESS_ANDA"}'
```
