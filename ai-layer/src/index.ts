// ============================================================
// INDEX.TS — Entry Point v4 — FULL DECENTRALIZATION
// NEW: Message signing, PEX, Distributed Pool, Permissionless Validator
// Vesting 4M ATC: TIDAK BERUBAH (wallet_local.ts)
// ============================================================

import { validateConfig } from "./setup/config_validator.js";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { startMonitor, stopMonitor } from "./activity/transaction_monitor.js";
import { getCivilizationState } from "./ai-layer/state.js";
import { initP2PServer, connectToInitialPeers, startHeartbeat } from "./p2p/p2p_network.js";
import { initTaskQueueHandlers } from "./p2p/task_queue.js";
import { initValidationHandlers } from "./p2p/validation_system.js";
import { loadLocalState } from "./p2p/local_state.js";
import { startOrchestrator } from "./ai-layer/self_evolution_orchestrator.js";
import { startAutonomousEngine } from "./ai-layer/autonomous_engine.js";
import { initDevWallet } from "./setup/auto_wallet_init.js";
import { startAutoBackup, stopAutoBackup } from "./setup/auto_backup.js";
import { aiDeveloper } from "./ai-layer/ai_developer_v2.js";

// ── NEW v4: Full Decentralization ─────────────────────────────
import { loadOrGenerateKeypair } from "./p2p/message_signer.js";
import { initPeerExchange, connectToBootstrapNodes } from "./p2p/peer_exchange.js";
import { initDistributedPool } from "./p2p/distributed_pool.js";
import { initPermissionlessValidator } from "./p2p/permissionless_validator.js";

// ── CONFIG VALIDATION ─────────────────────────────────────────
validateConfig();

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required.");
const port    = parseInt(rawPort, 10);
if (isNaN(port)) throw new Error("PORT must be a valid number: " + rawPort);

const server = app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "AITCOIN AI Layer v4 started");

  // ── KEYPAIR — Generate/load node identity (Ed25519) ────────
  try {
    const kp = loadOrGenerateKeypair();
    // Override NODE_ID dari keypair jika env tidak di-set
    if (!process.env["NODE_ID"] || process.env["NODE_ID"] === "auto") {
      process.env["NODE_ID"] = kp.nodeId;
    }
    logger.info({ nodeId: kp.nodeId }, "[Crypto] Node Ed25519 identity ready");
  } catch (err) {
    logger.warn({ err }, "[Crypto] Keypair init failed");
  }

  // ── AUTO BACKUP ────────────────────────────────────────────
  try { startAutoBackup(); } catch (err) { logger.warn({ err }, "[Backup] Failed"); }

  // ── LOCAL STATE ────────────────────────────────────────────
  try { loadLocalState(); logger.info("[LocalState] Loaded"); }
  catch (err) { logger.warn({ err }, "[LocalState] Starting fresh"); }

  // ── DEV WALLET — 4M ATC vesting (local-first, unchanged) ──
  initDevWallet().catch(err => logger.warn({ err }, "[WalletInit] Failed"));

  // ── AI DEVELOPER v2 ────────────────────────────────────────
  try {
    const s = aiDeveloper.getStatus("system_developer_01");
    logger.info({ level: s.level }, "[AIDev v2] Ready");
  } catch { /* ignore */ }

  // ── CIVILIZATION ───────────────────────────────────────────
  try { startMonitor(); getCivilizationState(); logger.info("[Civilization] ALIVE"); }
  catch (err) { logger.warn({ err }, "[Civilization] Failed"); }

  // ── P2P CORE NETWORK ───────────────────────────────────────
  try {
    initP2PServer();
    initTaskQueueHandlers();
    initValidationHandlers();
    connectToInitialPeers();
    startHeartbeat();
    logger.info("[P2P] Core network running");
  } catch (err) { logger.warn({ err }, "[P2P] Failed — standalone mode"); }

  // ── PEX — Auto peer discovery ──────────────────────────────
  try {
    initPeerExchange();
    connectToBootstrapNodes();
    logger.info("[PEX] Peer Exchange active — auto-discovery enabled");
  } catch (err) { logger.warn({ err }, "[PEX] Failed"); }

  // ── DISTRIBUTED POOL — AI economy tanpa DB terpusat ───────
  try {
    initDistributedPool();
    logger.info("[DistPool] AI pool tracking via P2P consensus");
  } catch (err) { logger.warn({ err }, "[DistPool] Failed"); }

  // ── PERMISSIONLESS VALIDATOR ───────────────────────────────
  try {
    initPermissionlessValidator();
    logger.info("[PVS] Permissionless validator system active");
  } catch (err) { logger.warn({ err }, "[PVS] Failed"); }

  // ── AUTONOMOUS ENGINE & ORCHESTRATOR ──────────────────────
  try { startAutonomousEngine(); logger.info("[AutoEngine] Running"); }
  catch (err) { logger.warn({ err }, "[AutoEngine] Failed"); }

  try { startOrchestrator(120_000); logger.info("[Orchestrator] Running"); }
  catch (err) { logger.warn({ err }, "[Orchestrator] Failed"); }

  logger.info({
    version:      "4.0",
    mode:         "FULLY_DECENTRALIZED",
    nodeType:     process.env["NODE_TYPE"]  ?? "AI_NODE",
    nodeId:       process.env["NODE_ID"]    ?? "auto",
    p2pPort:      process.env["P2P_PORT"]   ?? "9080",
    devWallet:    process.env["DEV_WALLET_ADDRESS"] ?? "AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5",
    adminUrl:     `http://localhost:${port}/admin`,
    decentralized: {
      messageSigning:        true,
      peerExchange:          true,
      distributedPool:       true,
      permissionlessValidator: true,
      localFirstWallet:      true,
      vestingProtected:      "4,000,000 ATC — local file, tidak butuh server",
    },
  }, "[STARTUP] AITCOIN AI Node FULLY DECENTRALIZED");
});

function shutdown(sig: string): void {
  logger.info({ sig }, "Shutdown");
  try { stopMonitor(); }    catch { /* ignore */ }
  try { stopAutoBackup(); } catch { /* ignore */ }
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
