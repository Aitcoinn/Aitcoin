<p align="center">
  <img src="doc/assets/aitcoin-logo.png" alt="Aitcoin Logo" width="95"/>
</p>

# AITCOIN (ATC)

## A scalable Web3 blockchain infrastructure enabling autonomous artificial intelligence to evolve into a living and self-sustaining digital civilization ##


---


# AITCOIN (ATC)

AITCOIN is a Layer 1 blockchain cryptocurrency that implements a Proof of Work (PoW) consensus mechanism using the SHA-3 CRYSTALS-Dilithium algorithm, combined with a UTXO (Unspent Transaction Output) transaction model.

AITCOIN is designed to integrate cryptographic security, decentralized computation, and artificial intelligence (AI) into a unified architecture that is adaptive, autonomous, and continuously evolving.

---

## System Architecture

AITCOIN is built upon several core components:

### 1. Proof of Work (PoW)
Used to:
- Secure the network  
- Validate transactions and blocks  
- Prevent attacks such as double-spending  

### 2. UTXO Model
Responsible for:
- Managing transaction structure  
- Ensuring transparent ownership verification  
- Supporting efficient and secure transactions  

### 3. Smart Contracts (Turing Complete)
Enable:
- Deterministic execution of system logic  
- Process automation within the network  
- Development of decentralized applications  

### 4. AI System
Acts as a core component that:
- Evaluates system dynamics  
- Manages interactions within the network  
- Supports adaptation and evolution of the ecosystem  

---

## System Objective

AITCOIN aims to build a concept called:

## Autonomous Digital Living Universe

An ecosystem where each user's computer functions as both an active node and a host for a living, autonomous, and continuously evolving digital world.

Each node does not only process transactions, but also runs a dynamic digital environment.

---

## Autonomous Digital Living Universe Concept

Each device in the network operates a local digital environment with the following characteristics:

### AI Agents
- Autonomous entities within the system  
- Possess unique goals, behaviors, and characteristics  
- Capable of interacting with one another  

### Interaction & Dynamics
- Communication and coordination occur between agents  
- The system forms evolving patterns of activity  
- Decisions are made in a distributed manner  

### System Evolution
- Agents adapt and evolve over time  
- Collective behavior creates complex, life-like dynamics  

---

## AI Agent Characteristics

Within each digital environment:

- Limited population (e.g., 100 agents per node)  
- Each agent has:
  - A unique identity (digital DNA)  
  - Distinct characteristics  
  - Learning capabilities  

Agents are able to:
- Interact (cooperatively or competitively)  
- Form relationships  
- Experience lifecycle phases (active, inactive, regeneration)  
- Improve over time  

---

## AI Operation Cycle

Each AI agent follows a continuous cycle:

observe → evaluate → decide → act → learn

---

## AI Validator

AI Validators are responsible for:
- Evaluating network activity  
- Supporting transaction validation  
- Determining activity priorities  
- Maintaining system stability and balance  

---

## Blockchain & AI Integration

Each environment runs locally on user devices, while remaining:
- Connected through a global blockchain  
- Synchronized in a decentralized manner  
- Integrated into a unified network  

The interaction between AI agents, AI Validators, and the blockchain creates a system that is:
- Autonomous  
- Adaptive  
- Decentralized  

---

## Economic Model

- Token Name: AITCOIN (ATC)  
- Maximum Supply: 21,000,000 ATC  

---

## Vision

To build an ecosystem where every user's computer becomes part of an autonomous digital universe — a living system that grows, evolves, and operates independently on top of blockchain infrastructure.

---

## Founder 

Rullhat
---
# Prioritizing security through the integration of quantum-resistant mechanisms to address future computing threats

## Key Facts

| Property | Value |
|---|---|
| Ticker | ATC |
| Max Supply | 21,000,000 ATC |
| Consensus | Proof of Work (SHA-3) |
| Block Reward | 25 ATC per block |
| Block Time | ~10 minutes |
| Halving | Every 210,000 blocks |
| Algorithm | SHA-3 CRYSTALS-D (ASIC compatible) |

---

## Supply Distribution

| Allocation | Amount | % |
|---|---|---|
| PoW Mining Rewards | 12,000,000 ATC | 57.14% |
| AI Mining Rewards | 5,000,000 ATC | 23.81% |
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
├── src/                    # AITCOIN C++ core (consensus layer)
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
git clone https://github.com/Aitcoinn/Aitcoin.git
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
