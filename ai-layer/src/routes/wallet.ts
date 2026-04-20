// ============================================================
// ROUTES/WALLET.TS — Wallet API (Local-First)
// Server hanya dibutuhkan di awal — setelah itu semua dari file lokal
// ============================================================

import { Router } from "express";
import {
  getLocalWalletStatus,
  getFullSchedule,
  claimFreeLocal,
  claimVestingLocal,
  initLocalWallet,
} from "../ecosystem/wallet_local.js";

export const walletRouter = Router();

// GET /api/wallet/status/:address — Local file, no DB needed
walletRouter.get("/status/:address", (_req, res) => {
  const status = getLocalWalletStatus();
  if (!status.initialized) {
    return res.status(404).json({ error: "Wallet not initialized yet. Server will auto-init on first start." });
  }
  return res.json({ source: "local_file", ...status });
});

// GET /api/wallet/schedule/:address — Full 39-month schedule from local file
walletRouter.get("/schedule/:address", (_req, res) => {
  const schedule = getFullSchedule();
  if (schedule.length === 0) {
    return res.status(404).json({ error: "Wallet not initialized" });
  }
  const now       = new Date();
  const summary   = {
    source:      "local_file",
    totalMonths: schedule.length,
    claimed:     schedule.filter(m => m.claimed).length,
    available:   schedule.filter(m => !m.claimed && new Date(m.unlockAt) <= now).length,
    locked:      schedule.filter(m => !m.claimed && new Date(m.unlockAt) > now).length,
    schedule,
  };
  return res.json(summary);
});

// POST /api/wallet/claim/free — Claim 100K free ATC (local, no DB)
walletRouter.post("/claim/free", (_req, res) => {
  const result = claimFreeLocal();
  return res.status(result.success ? 200 : 400).json({
    source: "local_file",
    ...result,
  });
});

// POST /api/wallet/claim/vesting — Claim available vesting months (local, no DB)
walletRouter.post("/claim/vesting", (_req, res) => {
  const result = claimVestingLocal();
  return res.status(result.success ? 200 : 400).json({
    source: "local_file",
    ...result,
  });
});

// POST /api/wallet/init — Manual init (if auto-init failed)
walletRouter.post("/init", (req, res) => {
  const { walletAddress, label } = req.body as { walletAddress?: string; label?: string };
  const addr = walletAddress ?? process.env["DEV_WALLET_ADDRESS"] ?? "AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5";
  try {
    const state = initLocalWallet(addr, label ?? "AITCOIN Development Fund");
    return res.json({
      success:  true,
      source:   "local_file",
      message:  "Wallet initialized locally. Server only used this once.",
      address:  state.walletAddress,
      total:    state.totalAllocated,
    });
  } catch (err) {
    return res.status(500).json({ error: "Init failed", detail: String(err) });
  }
});
