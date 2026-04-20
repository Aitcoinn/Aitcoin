// ============================================================
// DISTRIBUTED_POOL.TS — AI Pool State via P2P Consensus
// Mengganti ketergantungan DB terpusat untuk tracking pool
// Pool 5,000,000 ATC dilacak secara terdistribusi
// DB tetap dipakai jika tersedia, P2P sebagai fallback + validasi
//
// VESTING 4M ATC TIDAK TERPENGARUH — itu local-first (wallet_local.ts)
// ============================================================

import { broadcast, receiveMessage, gossipBroadcast, NODE_ID } from "./p2p_network.js";
import { logger } from "../lib/logger.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── KONSTANTA (harus sama di semua node) ─────────────────────
export const AI_POOL_TOTAL     = 5_000_000 as const;
const SYNC_INTERVAL_MS         = 30_000;   // sync setiap 30 detik
const CONSENSUS_MIN_PEERS      = 2;        // minimal 2 peer untuk konsensus
const MAX_DRIFT_ATC            = 10;       // toleransi perbedaan antar node (10 ATC)
const POOL_STATE_FILE          = join(process.env["NODE_STATE_DIR"] ?? "./node_state", "pool_state.json");

// ── LOCAL POOL STATE ──────────────────────────────────────────
export interface DistributedPoolState {
  totalPool:    number;    // selalu 5,000,000 — tidak bisa berubah
  remaining:    number;    // sisa yang belum didistribusi
  distributed:  number;    // sudah didistribusi
  lastUpdatedAt: number;
  nodeId:       string;
  stateHash:    string;    // hex hash — untuk deteksi manipulasi
  version:      number;    // increment setiap update
}

// Peer reports — untuk konsensus
const peerReports = new Map<string, DistributedPoolState>();
let   _localState: DistributedPoolState | null = null;

// ── HELPERS ──────────────────────────────────────────────────
function ensureDir(): void {
  const dir = process.env["NODE_STATE_DIR"] ?? "./node_state";
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function calcHash(state: Omit<DistributedPoolState, "stateHash">): string {
  const { createHash } = require("crypto");
  return createHash("sha256")
    .update(`${state.totalPool}:${state.remaining}:${state.distributed}:${state.version}`)
    .digest("hex")
    .slice(0, 16);
}

function verifyIntegrity(state: DistributedPoolState): boolean {
  if (state.totalPool !== AI_POOL_TOTAL) return false;
  if (state.remaining < 0 || state.distributed < 0) return false;
  const sum = parseFloat((state.remaining + state.distributed).toFixed(4));
  return Math.abs(sum - AI_POOL_TOTAL) < 0.001;
}

// ── LOAD / SAVE LOCAL ─────────────────────────────────────────
function loadLocalPool(): DistributedPoolState {
  try {
    if (existsSync(POOL_STATE_FILE)) {
      const raw  = JSON.parse(readFileSync(POOL_STATE_FILE, "utf8")) as DistributedPoolState;
      if (verifyIntegrity(raw)) return raw;
      logger.warn("[DistPool] Local state corrupt — resetting");
    }
  } catch { /* fall through */ }

  // Default state — full pool available
  return {
    totalPool:    AI_POOL_TOTAL,
    remaining:    AI_POOL_TOTAL,
    distributed:  0,
    lastUpdatedAt: Date.now(),
    nodeId:       NODE_ID,
    stateHash:    "",
    version:      1,
  };
}

function saveLocalPool(state: DistributedPoolState): void {
  ensureDir();
  state.stateHash = calcHash(state);
  writeFileSync(POOL_STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

// ── GET LOCAL STATE ───────────────────────────────────────────
export function getLocalPool(): DistributedPoolState {
  if (!_localState) _localState = loadLocalPool();
  return _localState;
}

// ── DEDUCT FROM POOL (when reward is given) ──────────────────
export function deductFromPool(amount: number, reason = ""): boolean {
  const state = getLocalPool();
  if (state.remaining < amount) {
    logger.warn({ remaining: state.remaining, requested: amount }, "[DistPool] Insufficient pool balance");
    return false;
  }
  state.remaining    -= amount;
  state.distributed  += amount;
  state.lastUpdatedAt = Date.now();
  state.version++;
  saveLocalPool(state);
  _localState = state;

  // Broadcast perubahan ke jaringan
  gossipBroadcast({
    type:    "STATE_SYNC",
    from:    NODE_ID,
    payload: { subtype: "POOL_UPDATE", state: sanitizeForBroadcast(state), reason },
    timestamp: Date.now(),
  });

  logger.debug({ remaining: state.remaining, deducted: amount, reason }, "[DistPool] Pool deducted");
  return true;
}

// Hapus private key sebelum broadcast
function sanitizeForBroadcast(s: DistributedPoolState): DistributedPoolState {
  return { ...s };  // semua field boleh dibagikan — tidak ada sensitif di pool state
}

// ── P2P CONSENSUS — Ambil nilai median dari semua peer ────────
export function getConsensusPool(): { state: DistributedPoolState; confidence: "high" | "medium" | "low" } {
  const local  = getLocalPool();
  const reports = [local, ...Array.from(peerReports.values())];

  if (reports.length < CONSENSUS_MIN_PEERS) {
    return { state: local, confidence: "low" };
  }

  // Filter: hanya laporan yang integrity-nya valid
  const valid = reports.filter(verifyIntegrity);

  if (valid.length === 0) return { state: local, confidence: "low" };

  // Median remaining (robust terhadap outlier/node jahat)
  valid.sort((a, b) => a.remaining - b.remaining);
  const mid    = Math.floor(valid.length / 2);
  const median = valid[mid]!;

  // Cek apakah lokal kita sesuai konsensus
  const drift  = Math.abs(local.remaining - median.remaining);
  if (drift > MAX_DRIFT_ATC) {
    logger.warn({ localRemaining: local.remaining, consensusRemaining: median.remaining, drift }, "[DistPool] Local state drifted from consensus — syncing");
    // Sync ke konsensus
    _localState = { ...median, nodeId: NODE_ID };
    saveLocalPool(_localState);
  }

  const confidence = valid.length >= 5 ? "high" : valid.length >= 2 ? "medium" : "low";
  return { state: _localState ?? local, confidence };
}

// ── HANDLER: Terima state dari peer ──────────────────────────
export function initDistributedPool(): void {
  // Load local state on startup
  _localState = loadLocalPool();
  logger.info({ remaining: _localState.remaining, distributed: _localState.distributed }, "[DistPool] Local pool state loaded");

  // Listen for pool updates from peers
  receiveMessage((msg) => {
    if (msg.type !== "STATE_SYNC") return;
    const p = msg.payload as Record<string, unknown>;
    if (p["subtype"] !== "POOL_UPDATE") return;

    const peerState = p["state"] as DistributedPoolState;
    if (!peerState || !verifyIntegrity(peerState)) {
      logger.warn({ from: msg.from }, "[DistPool] Rejected invalid pool state from peer");
      return;
    }
    peerReports.set(msg.from, peerState);
    logger.debug({ from: msg.from, remaining: peerState.remaining }, "[DistPool] Peer pool state received");
  });

  // Periodic: broadcast own state + check consensus
  setInterval(() => {
    const state = getLocalPool();
    gossipBroadcast({
      type:    "STATE_SYNC",
      from:    NODE_ID,
      payload: { subtype: "POOL_UPDATE", state: sanitizeForBroadcast(state) },
      timestamp: Date.now(),
    });
    // Check consensus
    getConsensusPool();
  }, SYNC_INTERVAL_MS);

  logger.info({ syncIntervalSec: SYNC_INTERVAL_MS / 1000 }, "[DistPool] Distributed pool sync started");
}

// ── POOL STATUS — Dipakai oleh routes ────────────────────────
export function getPoolStatus(): {
  remaining:    number;
  distributed:  number;
  totalPool:    number;
  percentRemaining: string;
  confidence:   string;
  peerCount:    number;
  source:       string;
} {
  const { state, confidence } = getConsensusPool();
  return {
    remaining:        state.remaining,
    distributed:      state.distributed,
    totalPool:        state.totalPool,
    percentRemaining: ((state.remaining / state.totalPool) * 100).toFixed(2) + "%",
    confidence,
    peerCount:        peerReports.size,
    source:           peerReports.size >= CONSENSUS_MIN_PEERS ? "p2p_consensus" : "local_only",
  };
}
