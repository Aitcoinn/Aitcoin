# AITCOIN (ATC) — Tokenomics

## Overview

| Property | Value |
|---|---|
| **Ticker** | ATC |
| **Max Supply** | 21,000,000 ATC |
| **Consensus** | Proof of Work (SHA-3 CRYSTALS-Dilithium) |
| **Block Reward** | 25 ATC per block |
| **Halving Interval** | Every 210,000 blocks (~4 years) |
| **Block Time** | ~10 minutes |

---

## Supply Distribution

| Allocation | Amount | % | Status |
|---|---|---|---|
| Proof of Work Mining | 12,000,000 ATC | 57.14% | Unlocked — earned by miners |
| AI Ecosystem Fund | 5,000,000 ATC | 23.81% | Milestone-vested |
| Development Fund | 4,000,000 ATC | 19.05% | Unlocked — dev team managed |


---

## Allocation Details

### 1. Proof of Work Mining — 12,000,000 ATC (57.14%)

The mining reward follows Bitcoin's proven emission schedule:

- **Block reward**: 25 ATC per block at genesis
- **Halving**: Every 210,000 blocks (~4 years), the reward halves
- **Schedule**: 25 → 12.5 → 6.25 → 3.125 → ... (asymptotic)
- **Immutable**: This parameter is enforced at the consensus layer and cannot be changed without a hard fork

Miners secure the network by solving SHA-256 proof-of-work puzzles. Block rewards are the sole mechanism for new ATC entering supply from the mining pool.

---

### 2. AI Ecosystem Fund — 5,000,000 ATC (23.81%)

Reserved for growing the AITCOIN AI Life Layer ecosystem:

- Developer grants for building on the AI Life Layer module
- Bounties for open-source contributions and security audits
- Integration rewards for dApps and wallets that support AI instances
- AI instance funding pools (running ACTIVE state AI agents on-chain)

**Vesting**: Released in milestone tranches:
- Tranche 1 (1,000,000 ATC): Mainnet launch
- Tranche 2 (1,500,000 ATC): 10+ AI module integrations shipped
- Tranche 3 (2,500,000 ATC): Ecosystem growth milestones (governance vote)

---

### 3. Development Fund — 4,000,000 ATC (19.05%)

Managed by the core development team for:

- Protocol engineering and maintenance
- AI Life Layer module development
- Infrastructure and node hosting
- Exchange listing fees
- Legal and compliance
- Security audits

**Wallet**: HD wallet secured with BIP39 seed phrase (24 words), stored offline by project lead on a hardware wallet. Derivation path: `m/44'/0'/0'/0/0`.

---

## AI Life Layer Integration

AITCOIN's unique innovation is the **AI Life Layer** — a decentralized digital civilization module where AI instances have lifecycle states tied to on-chain economic activity:

- **ACTIVE** — triggered by blockchain transactions
- **DORMANT** — after 5 minutes of no on-chain activity
- **ARCHIVED** — after 7 days of inactivity

AI instances hold energy (0–100), have persistent memory (JSONB), and are bound to AITCOIN wallet addresses. Every transaction on the AITCOIN network revives dormant AI instances automatically — creating a living, blockchain-powered AI civilization.

See [AI_LAYER.md](./AI_LAYER.md) for full technical details.

---

## Emission Schedule (Mining)

| Era | Block Range | Reward | ATC Minted |
|---|---|---|---|
| Genesis | 0 – 210,000 | 25 ATC | 5,250,000 |
| Era 2 | 210,001 – 420,000 | 12.5 ATC | 2,625,000 |
| Era 3 | 420,001 – 630,000 | 6.25 ATC | 1,312,500 |
| Era 4 | 630,001 – 840,000 | 3.125 ATC | 656,250 |
| ... | ... | ... | ... |
| **Asymptotic total** | ~2140 | → 0 | ~12,000,000 |

---

## Max Supply Cap

The **21,000,000 ATC hard cap** is enforced at the consensus layer, identical to Bitcoin's model. No additional coins can ever be created beyond this limit.

```
Mining pool (asymptotic) : 12,000,000 ATC
AI Ecosystem Fund        :  5,000,000 ATC
Development Fund         :  4,000,000 ATC
                         ─────────────────
Total Pre-mine           : 21,000,000 ATC (including mining pool ceiling)
```

> Note: The mining pool ceiling of 12M is the theoretical maximum reached asymptotically by ~year 2140. In practice, circulating supply grows slowly as blocks are mined.
