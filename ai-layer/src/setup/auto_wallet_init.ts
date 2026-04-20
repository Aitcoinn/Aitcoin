// ============================================================
// AUTO_WALLET_INIT.TS — One-time server + local init
// FLOW:
//   1. Check if local wallet file exists → if yes, skip
//   2. If not: call server registration (DB) — ONE TIME ONLY
//   3. After success: initialize local wallet file
//   4. All future ops read from local file, NOT server
// ============================================================

import { logger } from "../lib/logger.js";
import { isDbAvailable } from "../lib/db.js";
import { createWalletAllocation, getAllocationStatus } from "../ecosystem/wallet.js";
import {
  initLocalWallet,
  readLocalWallet,
  markServerSynced,
} from "../ecosystem/wallet_local.js";

const DEV_WALLET  = process.env["DEV_WALLET_ADDRESS"] ?? "AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5";
const LABEL       = "AITCOIN Development Fund";
const NOTES       = "4M ATC. 100K free + 3.9M vesting (100K/month × 39 months).";

export async function initDevWallet(): Promise<void> {
  // ── STEP 1: Check local file first (no server needed) ────
  const existing = readLocalWallet();
  if (existing && existing.walletAddress === DEV_WALLET && existing.serverSynced) {
    logger.info({
      address:    DEV_WALLET,
      version:    existing.version,
      totalClaim: existing.totalClaimed,
    }, "[WalletInit] ✅ Local wallet loaded — server NOT needed");
    return;  // ← Done. No server call at all.
  }

  // ── STEP 2: First time — try server registration (ONCE) ──
  logger.info("[WalletInit] First run — registering with server (one-time only)");

  if (isDbAvailable()) {
    try {
      const serverRecord = await getAllocationStatus(DEV_WALLET)
        ?? await createWalletAllocation(DEV_WALLET, LABEL, NOTES);

      logger.info({ address: DEV_WALLET, total: serverRecord.totalAllocated }, "[WalletInit] Server registration OK");

      // ── STEP 3: Save to local file — never need server again ──
      initLocalWallet(DEV_WALLET, LABEL);
      markServerSynced(DEV_WALLET);

      logger.info("[WalletInit] ✅ Local wallet file created. Future starts: no server needed.");
    } catch (err) {
      // Server failed — still init locally (offline mode)
      logger.warn({ err }, "[WalletInit] Server registration failed — initializing in offline mode");
      initLocalWallet(DEV_WALLET, LABEL);
    }
  } else {
    // No DB configured — init locally, skip server entirely
    logger.warn("[WalletInit] No DB — initializing wallet in OFFLINE mode (no server needed)");
    initLocalWallet(DEV_WALLET, LABEL);
  }
}
