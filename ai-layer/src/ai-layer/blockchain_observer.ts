// ============================================================
// BLOCKCHAIN_OBSERVER.TS — Cross-Layer Awareness (#24)
// AI memahami status blockchain TANPA mengubahnya
// Read-only observer — tidak ada aksi ke C++ layer
// ============================================================

import { emit } from "./system_monitor.js";

export interface BlockchainStatus {
  observedAt:       number;
  blockHeight:      number;
  lastBlockTime:    number;  // timestamp
  networkHashrate:  number;  // estimated H/s
  txPoolSize:       number;
  avgBlockInterval: number;  // seconds
  peerCount:        number;
  syncProgress:     number;  // 0-1
  isHealthy:        boolean;
  anomalies:        string[];
}

export interface AIBehaviorAdjustment {
  reason:         string;
  recommendedMode: "aggressive" | "normal" | "conservative" | "minimal";
  description:    string;
}

// ── Simulated blockchain state (read from IPC / REST in production) ──────────
let cachedStatus: BlockchainStatus = {
  observedAt:       Date.now(),
  blockHeight:      0,
  lastBlockTime:    Date.now(),
  networkHashrate:  0,
  txPoolSize:       0,
  avgBlockInterval: 600,
  peerCount:        0,
  syncProgress:     1.0,
  isHealthy:        true,
  anomalies:        [],
};

// ── Fetch blockchain status from local node RPC ───────────────
export async function refreshBlockchainStatus(rpcUrl?: string): Promise<BlockchainStatus> {
  const url = rpcUrl ?? process.env["AITCOIN_RPC_URL"] ?? "http://127.0.0.1:9882";
  try {
    const resp = await fetch(`${url}/status`, { signal: AbortSignal.timeout(3000) });
    if (resp.ok) {
      const data = await resp.json() as Partial<BlockchainStatus>;
      cachedStatus = {
        observedAt:       Date.now(),
        blockHeight:      data.blockHeight      ?? cachedStatus.blockHeight,
        lastBlockTime:    data.lastBlockTime    ?? cachedStatus.lastBlockTime,
        networkHashrate:  data.networkHashrate  ?? cachedStatus.networkHashrate,
        txPoolSize:       data.txPoolSize       ?? cachedStatus.txPoolSize,
        avgBlockInterval: data.avgBlockInterval ?? cachedStatus.avgBlockInterval,
        peerCount:        data.peerCount        ?? cachedStatus.peerCount,
        syncProgress:     data.syncProgress     ?? 1.0,
        isHealthy:        data.isHealthy        ?? true,
        anomalies:        [],
      };
    }
  } catch {
    // Node not running or RPC unavailable — use cached
    emit("health", "info", "blockchain_observer",
      "Blockchain RPC unavailable — using cached state");
  }

  // Detect anomalies in observed state
  cachedStatus.anomalies = [];
  const timeSinceBlock = (Date.now() - cachedStatus.lastBlockTime) / 1000;
  if (timeSinceBlock > cachedStatus.avgBlockInterval * 3) {
    cachedStatus.anomalies.push(`Block delay: ${timeSinceBlock.toFixed(0)}s (expected ~${cachedStatus.avgBlockInterval}s)`);
    cachedStatus.isHealthy = false;
  }
  if (cachedStatus.peerCount === 0) {
    cachedStatus.anomalies.push("No peers connected");
  }
  if (cachedStatus.txPoolSize > 10000) {
    cachedStatus.anomalies.push(`Large mempool: ${cachedStatus.txPoolSize} txs`);
  }

  return cachedStatus;
}

// ── AI behavior recommendation based on blockchain state ──────
export function recommendAIBehavior(): AIBehaviorAdjustment {
  const s = cachedStatus;
  if (!s.isHealthy || s.syncProgress < 0.9) {
    return {
      reason: "Blockchain unhealthy or syncing",
      recommendedMode: "minimal",
      description: "Reduce AI activity — chain is not fully operational",
    };
  }
  if (s.txPoolSize > 5000) {
    return {
      reason: "High mempool congestion",
      recommendedMode: "conservative",
      description: "Limit AI-generated transactions — mempool congested",
    };
  }
  if (s.peerCount < 3) {
    return {
      reason: "Low peer count",
      recommendedMode: "conservative",
      description: "Network connectivity limited — operate cautiously",
    };
  }
  if (s.avgBlockInterval < 300) {
    return {
      reason: "Fast block time",
      recommendedMode: "aggressive",
      description: "Network is fast — AI can operate at full capacity",
    };
  }
  return {
    reason: "Normal network conditions",
    recommendedMode: "normal",
    description: "Standard AI operation",
  };
}

export function getObservedStatus(): BlockchainStatus { return { ...cachedStatus }; }

export function updateSimulatedStatus(patch: Partial<BlockchainStatus>): void {
  // For testing/simulation — allow external update of observed state
  cachedStatus = { ...cachedStatus, ...patch, observedAt: Date.now() };
}
