// ============================================================
// ROUTES/NODE.TS — Node Info & Enhanced Health
// /api/node/info    — Detail lengkap node
// /api/node/health  — Health check komprehensif
// /api/node/blockchain — Status sync blockchain (via RPC)
// ============================================================

import { Router } from "express";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { rpcClient } from "../lib/rpc_client.js";
import { getLocalWalletStatus } from "../ecosystem/wallet_local.js";
import { getDbInfo, isDbAvailable } from "../lib/db.js";
import { logger } from "../lib/logger.js";

const router = Router();

const START_TIME = Date.now();

function uptimeFormatted(): string {
  const s = Math.floor((Date.now() - START_TIME) / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

function memoryUsage(): Record<string, string> {
  const mem = process.memoryUsage();
  const mb   = (n: number) => (n / 1024 / 1024).toFixed(1) + " MB";
  return {
    rss:       mb(mem.rss),
    heapUsed:  mb(mem.heapUsed),
    heapTotal: mb(mem.heapTotal),
    external:  mb(mem.external),
  };
}

function readPkg(): { version: string; name: string } {
  try {
    const p = join(process.cwd(), "package.json");
    if (existsSync(p)) {
      const pkg = JSON.parse(readFileSync(p, "utf8")) as { version?: string; name?: string };
      return { version: pkg.version ?? "2.0.0", name: pkg.name ?? "aitcoin-ai-layer" };
    }
  } catch { /* ignore */ }
  return { version: "2.0.0", name: "aitcoin-ai-layer" };
}

// GET /api/node/info — Static info, always fast
router.get("/node/info", (_req, res) => {
  const pkg    = readPkg();
  const wallet = getLocalWalletStatus();
  return res.json({
    name:          pkg.name,
    version:       pkg.version,
    nodeType:      process.env["NODE_TYPE"]  ?? "AI_NODE",
    nodeId:        process.env["NODE_ID"]    ?? "auto",
    network:       "AITCOIN Mainnet",
    p2pPort:       process.env["P2P_PORT"]   ?? "9080",
    devWallet:     process.env["DEV_WALLET_ADDRESS"] ?? "AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5",
    walletReady:   wallet.initialized,
    uptime:        uptimeFormatted(),
    uptimeMs:      Date.now() - START_TIME,
    startedAt:     new Date(START_TIME).toISOString(),
    nodeVersion:   process.version,
    platform:      process.platform,
    memory:        memoryUsage(),
    db:            isDbAvailable() ? "connected" : "offline",
  });
});

// GET /api/node/health — Full health check
router.get("/node/health", async (_req, res) => {
  const wallet  = getLocalWalletStatus();
  const dbInfo  = getDbInfo();
  const rpcAlive = await rpcClient.isAlive().catch(() => false);

  const checks = {
    server:     { status: "ok" },
    db:         { status: isDbAvailable() ? "ok" : "offline",  detail: dbInfo },
    wallet:     { status: wallet.initialized  ? "ok" : "not_initialized", detail: wallet.initialized ? { address: wallet.walletAddress, totalClaimed: wallet.totalClaimed } : null },
    blockchain: { status: rpcAlive ? "ok" : "offline", detail: rpcAlive ? "AITCOIN node reachable" : "RPC not configured or node offline (optional)" },
    memory:     { status: "ok", detail: memoryUsage() },
    uptime:     { status: "ok", detail: uptimeFormatted() },
  };

  const allOk     = checks.server.status === "ok" && checks.wallet.status !== "error";
  const httpCode  = allOk ? 200 : 503;

  return res.status(httpCode).json({
    status:   allOk ? "healthy" : "degraded",
    checks,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/node/blockchain — Blockchain sync status via RPC
router.get("/node/blockchain", async (_req, res) => {
  try {
    const [sync, network, mining] = await Promise.all([
      rpcClient.getSyncStatus(),
      rpcClient.getNetworkInfo().catch(() => null),
      rpcClient.getMiningInfo().catch(() => null),
    ]);
    return res.json({
      connected:   true,
      sync,
      network,
      mining,
      queriedAt:   new Date().toISOString(),
    });
  } catch (err) {
    logger.warn({ err }, "[NodeRoute] Blockchain RPC unavailable");
    return res.status(503).json({
      connected: false,
      message:   "AITCOIN node RPC not reachable. Set AITCOIN_RPC_URL in .env to connect.",
      hint:      "Node must be running: ./src/aitcoind -daemon",
    });
  }
});

export default router;

// GET /api/node/pool — Distributed pool status (no DB needed)
router.get("/node/pool", (_req, res) => {
  try {
    const { getPoolStatus } = require("../p2p/distributed_pool.js");
    return res.json(getPoolStatus());
  } catch {
    return res.status(503).json({ error: "Distributed pool not initialized yet" });
  }
});

// GET /api/node/validators — Active validator set
router.get("/node/validators", (_req, res) => {
  try {
    const { getActiveValidators, getValidatorCount } = require("../p2p/permissionless_validator.js");
    return res.json({
      count:      getValidatorCount(),
      validators: getActiveValidators(),
    });
  } catch {
    return res.status(503).json({ error: "Validator system not initialized" });
  }
});

// GET /api/node/identity — This node's public key
router.get("/node/identity", (_req, res) => {
  try {
    const { getPublicKey, getNodeId } = require("../p2p/message_signer.js");
    return res.json({
      nodeId:    getNodeId(),
      publicKey: getPublicKey(),
      network:   "AITCOIN Mainnet",
      keyType:   "Ed25519",
    });
  } catch {
    return res.status(503).json({ error: "Node identity not initialized" });
  }
});
