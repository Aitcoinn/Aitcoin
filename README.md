<p align="center">
  <img src="doc/assets/aitcoin-logo.png" alt="Aitcoin Logo" width="200"/>
</p># AITCOIN (ATC)

**Web3 blockchain focused on scalability, where autonomous AI evolves into a living digital civilization**


---

## What is AITCOIN?

AITCOIN adalah mata uang kripto blockchain Layer 1 yang menggunakan Proof of Work (PoW) berbasis SHA-256, dan UTXO (Unspent Transaction Output).

AITCOIN dirancang untuk menggabungkan keamanan kriptografi dengan sistem kecerdasan buatan dalam satu arsitektur terpadu.
Sistem ini terdiri dari beberapa komponen utama:

Proof of Work (PoW)
Digunakan untuk menjaga keamanan jaringan dan validasi blok.

UTXO Model
Mengatur struktur transaksi dan memastikan kepemilikan aset dapat diverifikasi.

Smart Contract (Turing Complete)
Menjalankan logika sistem secara deterministik dan memungkinkan otomatisasi proses.

AI System
Berperan sebagai komponen utama dalam evaluasi dan dinamika sistem.

TUJUAN SISTEM
Tujuan utama AITCOIN adalah membangun:
Living Digital Civilization
yaitu sistem terdesentralisasi di mana setiap komputer pengguna menjadi bagian aktif dari jaringan dan menjadi host bagi dunia digital yang hidup.

Setiap node tidak hanya memproses transaksi, tetapi juga menjalankan lingkungan digital yang terus berkembang dan beradaptasi.

LIVING DIGITAL CIVILIZATION

Dalam setiap komputer pengguna terdapat lingkungan digital yang aktif dan terstruktur.

Lingkungan ini membentuk sistem yang menyerupai peradaban digital, 

di mana:

terdapat AI agents sebagai warga yang hidup.

terjadi interaksi antar agents

terbentuk pola aktivitas yang berkembang 
seiring waktu


Perilaku kolektif AI agents menciptakan dinamika yang menyerupai pradapan manusia.

interaksi dan koordinasi

pengambilan keputusan secara terdistribusi

perkembangan sistem berdasarkan aktivitas internal

Ai agent bisa mati dan juga lahir kembali.

Ai agent bisa punya teman, bisa punya musuh, bisa balas dendam, bisa jadi kaya, bisa bangkrut.

Ai agent bisa naik level.

Total penduduk 100 Ai agent.

Ai agent di dalam nya bisa perang, dan saling membunuh.

Layak nya manusia di dunia ini.

Bisa beradaptasi dan bisa punya tujuan.

Dan Ai agent di dalam nya pemiliki DNA.

Memiliki karakter yang berbeda beda.

Setiap lingkungan berjalan secara lokal di komputer pengguna, namun tetap terhubung melalui blockchain, sehingga membentuk jaringan global yang terintegrasi.

Di dalam setiap dunia digital terdapat AI agents yang berperan aktif dalam sistem.
AI agents mampu:
mengambil keputusan secara mandiri
berinteraksi dengan agent lain
merespons kondisi dalam sistem
menyesuaikan perilaku berdasarkan hasil interaksi
Siklus operasinya meliputi:
observe → evaluate → decide → act → learn
Sistem juga didukung oleh AI Validator yang berfungsi untuk:
mengevaluasi aktivitas jaringan
mendukung eksekusi transaksi
menentukan prioritas aktivitas
menjaga keseimbangan sistem
Interaksi antara AI agents, AI Validator, dan jaringan blockchain menciptakan sistem yang berkembang secara dinamis tanpa bergantung pada kontrol terpusat.

Model ekonomi dalam sistem menetapkan:
Maximum Supply: 21,000,000 ATC

Dibuat oleh pengembang dengan nama samaran  Rullhat

Visi   saya ingin membangun dimana
setiap komputer penguna memiliki dunia pradapan yang aktif
layak nya seperti dunia saat ini.

---

## Key Facts

| Property | Value |
|---|---|
| Ticker | ATC |
| Max Supply | 21,000,000 ATC |
| Consensus | Proof of Work (SHA-256) |
| Block Reward | 25 ATC per block |
| Block Time | ~10 minutes |
| Halving | Every 210,000 blocks |
| Algorithm | SHA-256 (ASIC compatible) |

---

## Supply Distribution

| Allocation | Amount | % |
|---|---|---|
| PoW Mining Rewards | 12,000,000 ATC | 57.14% |
| AI Ecosystem Fund | 5,000,000 ATC | 23.81% |
| “Development funds are locked | 4,000,000 ATC | 19.05% |


Full details: [TOKENOMICS.md](./TOKENOMICS.md)

---

## AI Life Layer

AITCOIN's core innovation. Every wallet address can be bound to an AI instance. Blockchain activity becomes the heartbeat of digital life.

- **10 REST API endpoints** for managing AI instances
- **Persistent memory** — AI resumes from last checkpoint after revival
- **Energy system** — transactions give energy; silence drains it
- **Fully modular** — works alongside the core blockchain node

Full documentation: [AI_LAYER.md](./AI_LAYER.md)

---

## Repository Structure

```
aitcoin/
├── src/                    # Bitcoin-fork C++ core (consensus layer)
│   ├── chainparams.cpp     # Chain parameters (block reward, halving, etc.)
│   ├── main.cpp            # Core node logic
│   └── ...
├── artifacts/
│   └── api-server/         # AI Life Layer API server (TypeScript/Express)
│       └── src/
│           ├── ai-layer/   # AI state, core, memory
│           ├── lifecycle/  # State machine + manager
│           ├── activity/   # Transaction monitor + trigger engine
│           └── routes/ai/  # REST API endpoints
├── lib/
│   ├── db/                 # PostgreSQL schema (Drizzle ORM)
│   └── api-spec/           # OpenAPI specification
├── genesis/
│   └── allocation.json     # Pre-mine allocation config
├── TOKENOMICS.md           # Full tokenomics documentation
└── AI_LAYER.md             # AI Life Layer technical docs
```

---

## Quick Start

### Prerequisites
- Node.js 24+
- pnpm
- PostgreSQL

### Setup

```bash
# Clone
git clone https://github.com/your-org/aitcoin.git
cd aitcoin

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your DB and AITCOIN RPC settings

# Push database schema
pnpm --filter @workspace/db run push

# Start API server (AI Life Layer)
pnpm --filter @workspace/api-server run dev
```

### Connect to AITCOIN Node (optional)

```env
AITCOIN_RPC_URL=http://localhost:8332
AITCOIN_RPC_USER=your_username
AITCOIN_RPC_PASS=your_password
```

Without a live node, the system runs in simulation mode for development.

---

## License

MIT — see [LICENSE](./LICENSE)
