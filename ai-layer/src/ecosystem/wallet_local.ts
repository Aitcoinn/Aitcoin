// ============================================================
// WALLET_LOCAL.TS — Local-First Wallet State
// ============================================================
// ARSITEKTUR:
//   • Server hanya dibutuhkan SEKALI — saat registrasi pertama
//   • Setelah itu semua data tersimpan di file lokal
//   • Vesting schedule, status, klaim — semua dari file lokal
//   • Blockchain RPC dipakai untuk verifikasi opsional
//   • Tidak butuh koneksi server atau DB setelah setup awal
// ============================================================

import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { logger } from "../lib/logger.js";

// ── TYPES ──────────────────────────────────────────────────
export interface VestingMonth {
  month:       number;
  unlockAt:    string;     // ISO date string
  amount:      number;
  claimed:     boolean;
  claimedAt?:  string;
}

export interface LocalWalletState {
  walletAddress:    string;
  label:            string;
  network:          string;
  derivationPath:   string;
  totalAllocated:   number;
  freeAmount:       number;
  freeClaimed:      boolean;
  freeClaimedAt?:   string;
  vestingTotal:     number;
  vestingStartAt:   string;
  vestingSchedule:  VestingMonth[];      // 39-item array — full schedule
  totalClaimed:     number;
  registeredAt:     string;
  lastUpdatedAt:    string;
  version:          number;              // increment on each save
  serverSynced:     boolean;            // true = registered with server once
  blockchainVerified: boolean;
}

// ── PATHS ──────────────────────────────────────────────────
const WALLET_DIR  = process.env["WALLET_STATE_DIR"] ?? "./wallet_state";
const WALLET_FILE = join(WALLET_DIR, "dev_wallet.json");
const ONE_MONTH   = 30 * 24 * 60 * 60 * 1000;

// ── HELPERS ────────────────────────────────────────────────
function ensureDir(): void {
  if (!existsSync(WALLET_DIR)) mkdirSync(WALLET_DIR, { recursive: true });
}

function buildSchedule(startAt: Date, totalMonths = 39, monthlyAmount = 100_000): VestingMonth[] {
  return Array.from({ length: totalMonths }, (_, i) => ({
    month:    i + 1,
    unlockAt: new Date(startAt.getTime() + (i + 1) * ONE_MONTH).toISOString(),
    amount:   monthlyAmount,
    claimed:  false,
  }));
}

// ── READ LOCAL STATE ────────────────────────────────────────
export function readLocalWallet(): LocalWalletState | null {
  try {
    if (!existsSync(WALLET_FILE)) return null;
    return JSON.parse(readFileSync(WALLET_FILE, "utf8")) as LocalWalletState;
  } catch (err) {
    logger.warn({ err }, "[WalletLocal] Failed to read local wallet state");
    return null;
  }
}

// ── SAVE LOCAL STATE ────────────────────────────────────────
function saveLocalWallet(state: LocalWalletState): void {
  ensureDir();
  state.lastUpdatedAt = new Date().toISOString();
  state.version       = (state.version ?? 0) + 1;
  writeFileSync(WALLET_FILE, JSON.stringify(state, null, 2), "utf8");
}

// ── INIT — Called ONCE after server registration ────────────
// This is the ONLY moment server is needed.
// After this runs, the wallet is fully self-contained locally.
export function initLocalWallet(
  walletAddress:  string,
  label:          string,
  freeAmount      = 100_000,
  vestingTotal    = 3_900_000,
): LocalWalletState {
  const existing = readLocalWallet();
  if (existing && existing.walletAddress === walletAddress) {
    logger.info("[WalletLocal] Local wallet already initialized");
    return existing;
  }

  const now      = new Date();
  const state: LocalWalletState = {
    walletAddress,
    label,
    network:          "AITCOIN Mainnet",
    derivationPath:   "m/44'/0'/0'/0/0",
    totalAllocated:   freeAmount + vestingTotal,
    freeAmount,
    freeClaimed:      false,
    vestingTotal,
    vestingStartAt:   now.toISOString(),
    vestingSchedule:  buildSchedule(now),
    totalClaimed:     0,
    registeredAt:     now.toISOString(),
    lastUpdatedAt:    now.toISOString(),
    version:          1,
    serverSynced:     true,     // will be set true after server registration
    blockchainVerified: false,
  };

  saveLocalWallet(state);
  logger.info({ walletAddress, total: freeAmount + vestingTotal }, "[WalletLocal] Local wallet state initialized");
  return state;
}

// ── CLAIM FREE — No server needed ──────────────────────────
export function claimFreeLocal(): {
  success:  boolean;
  amount:   number;
  message:  string;
} {
  const state = readLocalWallet();
  if (!state)            return { success: false, amount: 0, message: "Wallet not initialized. Run initLocalWallet() first." };
  if (state.freeClaimed) return { success: false, amount: 0, message: "Free allocation already claimed." };

  state.freeClaimed    = true;
  state.freeClaimedAt  = new Date().toISOString();
  state.totalClaimed  += state.freeAmount;
  saveLocalWallet(state);

  logger.info({ amount: state.freeAmount }, "[WalletLocal] Free allocation claimed locally");
  return {
    success: true,
    amount:  state.freeAmount,
    message: `${state.freeAmount.toLocaleString()} ATC free allocation claimed. Saved locally.`,
  };
}

// ── CLAIM VESTING — No server needed ───────────────────────
export function claimVestingLocal(): {
  success:         boolean;
  amount:          number;
  message:         string;
  monthsClaimed:   number;
  remaining:       number;
  nextUnlockAt?:   string;
} {
  const state = readLocalWallet();
  if (!state) return { success: false, amount: 0, message: "Wallet not initialized.", monthsClaimed: 0, remaining: 0 };

  const now = Date.now();
  const claimable = state.vestingSchedule.filter(
    m => !m.claimed && new Date(m.unlockAt).getTime() <= now
  );

  if (claimable.length === 0) {
    const next = state.vestingSchedule.find(m => !m.claimed);
    return {
      success:       false,
      amount:        0,
      message:       next
        ? `Next vesting unlocks at ${next.unlockAt}`
        : "All vesting months claimed.",
      monthsClaimed: state.vestingSchedule.filter(m => m.claimed).length,
      remaining:     state.vestingSchedule.filter(m => !m.claimed).length,
      nextUnlockAt:  next?.unlockAt,
    };
  }

  const totalAmount = claimable.reduce((sum, m) => sum + m.amount, 0);
  const claimedNow  = new Date().toISOString();

  // Mark claimed months in local schedule
  for (const m of state.vestingSchedule) {
    if (claimable.find(c => c.month === m.month)) {
      m.claimed    = true;
      m.claimedAt  = claimedNow;
    }
  }
  state.totalClaimed += totalAmount;
  saveLocalWallet(state);

  const remaining  = state.vestingSchedule.filter(m => !m.claimed);
  const nextUnlock = remaining[0];

  logger.info({ months: claimable.length, amount: totalAmount }, "[WalletLocal] Vesting claimed locally");
  return {
    success:       true,
    amount:        totalAmount,
    message:       `${totalAmount.toLocaleString()} ATC claimed (${claimable.length} month${claimable.length > 1 ? "s" : ""}). Saved locally — no server needed.`,
    monthsClaimed: state.vestingSchedule.filter(m => m.claimed).length,
    remaining:     remaining.length,
    nextUnlockAt:  nextUnlock?.unlockAt,
  };
}

// ── GET STATUS — Fully local, no server ────────────────────
export function getLocalWalletStatus(): {
  initialized:      boolean;
  walletAddress?:   string;
  totalAllocated?:  number;
  totalClaimed?:    number;
  freeClaimed?:     boolean;
  vestingProgress?: string;
  monthsClaimed?:   number;
  remaining?:       number;
  nextUnlockAt?:    string;
  availableNow?:    number;
  schedulePreview?: VestingMonth[];
} {
  const state = readLocalWallet();
  if (!state) return { initialized: false };

  const now          = Date.now();
  const claimedCount = state.vestingSchedule.filter(m => m.claimed).length;
  const remaining    = state.vestingSchedule.filter(m => !m.claimed);
  const availableNow = state.vestingSchedule.filter(
    m => !m.claimed && new Date(m.unlockAt).getTime() <= now
  ).reduce((sum, m) => sum + m.amount, 0);
  const nextUnlock   = remaining.find(m => !m.claimed);

  return {
    initialized:     true,
    walletAddress:   state.walletAddress,
    totalAllocated:  state.totalAllocated,
    totalClaimed:    state.totalClaimed,
    freeClaimed:     state.freeClaimed,
    vestingProgress: `${claimedCount}/${state.vestingSchedule.length} months claimed`,
    monthsClaimed:   claimedCount,
    remaining:       remaining.length,
    nextUnlockAt:    nextUnlock?.unlockAt,
    availableNow:    availableNow + (state.freeClaimed ? 0 : state.freeAmount),
    schedulePreview: state.vestingSchedule.slice(0, 5), // first 5 months preview
  };
}

// ── EXPORT FULL SCHEDULE — No server ───────────────────────
export function getFullSchedule(): VestingMonth[] {
  const state = readLocalWallet();
  return state?.vestingSchedule ?? [];
}

// ── MARK SERVER SYNCED — After successful server registration ──
export function markServerSynced(walletAddress: string): void {
  const state = readLocalWallet();
  if (!state || state.walletAddress !== walletAddress) return;
  state.serverSynced = true;
  saveLocalWallet(state);
}

// ── VERIFY VIA BLOCKCHAIN RPC — Optional, not required ─────
export async function verifyViaBlockchain(rpcUrl: string, rpcUser: string, rpcPass: string): Promise<boolean> {
  const state = readLocalWallet();
  if (!state) return false;
  try {
    const auth     = Buffer.from(`${rpcUser}:${rpcPass}`).toString("base64");
    const response = await fetch(rpcUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body:    JSON.stringify({ jsonrpc: "1.0", id: "wallet", method: "validateaddress", params: [state.walletAddress] }),
      signal:  AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const data = (await response.json()) as { result: { isvalid: boolean } };
    const valid = data.result?.isvalid === true;
    if (valid) {
      const s = readLocalWallet();
      if (s) { s.blockchainVerified = true; saveLocalWallet(s); }
    }
    logger.info({ valid, address: state.walletAddress }, "[WalletLocal] Blockchain verification");
    return valid;
  } catch {
    logger.warn("[WalletLocal] Blockchain RPC not reachable — continuing in offline mode");
    return false;
  }
}
