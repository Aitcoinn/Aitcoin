// ============================================================
// WALLET_CLI.TS — Standalone Wallet Tool (NO SERVER NEEDED)
// Jalankan: tsx src/wallet_cli.ts [command]
// Commands:
//   init [address] [label]  — Inisialisasi wallet lokal (sekali saja)
//   status                  — Lihat status wallet
//   schedule                — Lihat jadwal vesting lengkap
//   claim:free              — Klaim 100K ATC bebas
//   claim:vesting           — Klaim vesting bulan ini
//   verify                  — Verifikasi via blockchain RPC (opsional)
// ============================================================

import {
  initLocalWallet,
  readLocalWallet,
  claimFreeLocal,
  claimVestingLocal,
  getLocalWalletStatus,
  getFullSchedule,
  verifyViaBlockchain,
} from "./ecosystem/wallet_local.js";

const DEV_WALLET = process.env["DEV_WALLET_ADDRESS"] ?? "AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5";
const args = process.argv.slice(2);
const cmd  = args[0] ?? "status";

function printLine() { console.log("─".repeat(60)); }
function printHeader(title: string) {
  printLine();
  console.log(` AITCOIN Wallet CLI — ${title}`);
  printLine();
}

switch (cmd) {
  // ── INIT ────────────────────────────────────────────────
  case "init": {
    const addr  = args[1] ?? DEV_WALLET;
    const label = args.slice(2).join(" ") || "AITCOIN Development Fund";
    printHeader("Initialize Wallet");
    console.log(`Address : ${addr}`);
    console.log(`Label   : ${label}`);
    console.log("");
    const state = initLocalWallet(addr, label);
    console.log("✅ Wallet initialized locally!");
    console.log(`   Total allocated : ${state.totalAllocated.toLocaleString()} ATC`);
    console.log(`   Free available  : ${state.freeAmount.toLocaleString()} ATC`);
    console.log(`   Vesting total   : ${state.vestingTotal.toLocaleString()} ATC`);
    console.log(`   Vesting months  : ${state.vestingSchedule.length} months × 100,000 ATC`);
    console.log(`   First unlock    : ${state.vestingSchedule[0]?.unlockAt ?? "N/A"}`);
    console.log("");
    console.log("ℹ️  Server needed ONLY for first-time registration.");
    console.log("   All subsequent operations work OFFLINE.");
    printLine();
    break;
  }

  // ── STATUS ──────────────────────────────────────────────
  case "status": {
    printHeader("Wallet Status");
    const status = getLocalWalletStatus();
    if (!status.initialized) {
      console.log("❌ Wallet not initialized. Run: tsx src/wallet_cli.ts init");
      break;
    }
    console.log(`Address         : ${status.walletAddress}`);
    console.log(`Total Allocated : ${status.totalAllocated?.toLocaleString()} ATC`);
    console.log(`Total Claimed   : ${status.totalClaimed?.toLocaleString()} ATC`);
    console.log(`Free Claimed    : ${status.freeClaimed ? "✅ Yes" : "❌ Not yet"}`);
    console.log(`Vesting Progress: ${status.vestingProgress}`);
    console.log(`Available Now   : ${status.availableNow?.toLocaleString()} ATC`);
    console.log(`Next Unlock     : ${status.nextUnlockAt ?? "All claimed!"}`);
    console.log("");
    console.log("(Read from local file — no server needed)");
    printLine();
    break;
  }

  // ── SCHEDULE ────────────────────────────────────────────
  case "schedule": {
    printHeader("Vesting Schedule — 39 Months");
    const schedule = getFullSchedule();
    if (schedule.length === 0) {
      console.log("❌ Wallet not initialized. Run: tsx src/wallet_cli.ts init");
      break;
    }
    console.log("Month | Unlock Date             | Amount    | Status");
    printLine();
    for (const m of schedule) {
      const date   = new Date(m.unlockAt).toLocaleDateString("id-ID");
      const status = m.claimed ? `✅ Claimed ${m.claimedAt ? new Date(m.claimedAt).toLocaleDateString("id-ID") : ""}` : (new Date(m.unlockAt) <= new Date() ? "🔓 AVAILABLE" : "🔒 Locked");
      console.log(`  ${String(m.month).padStart(2)} | ${date.padEnd(23)} | ${m.amount.toLocaleString().padStart(9)} | ${status}`);
    }
    printLine();
    const claimed = schedule.filter(m => m.claimed).length;
    const avail   = schedule.filter(m => !m.claimed && new Date(m.unlockAt) <= new Date()).length;
    console.log(`Total: ${claimed} claimed, ${avail} available now, ${schedule.length - claimed - avail} still locked`);
    printLine();
    break;
  }

  // ── CLAIM FREE ──────────────────────────────────────────
  case "claim:free": {
    printHeader("Claim Free Allocation");
    const result = claimFreeLocal();
    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`   Amount: ${result.amount.toLocaleString()} ATC`);
      console.log("   Saved to local wallet file — no server needed.");
    } else {
      console.log(`ℹ️  ${result.message}`);
    }
    printLine();
    break;
  }

  // ── CLAIM VESTING ────────────────────────────────────────
  case "claim:vesting": {
    printHeader("Claim Monthly Vesting");
    const result = claimVestingLocal();
    if (result.success) {
      console.log(`✅ ${result.message}`);
      console.log(`   Amount         : ${result.amount.toLocaleString()} ATC`);
      console.log(`   Months Claimed : ${result.monthsClaimed}/39`);
      console.log(`   Remaining      : ${result.remaining} months`);
      if (result.nextUnlockAt) console.log(`   Next Unlock    : ${result.nextUnlockAt}`);
      console.log("   Saved to local wallet file — no server needed.");
    } else {
      console.log(`ℹ️  ${result.message}`);
      if (result.nextUnlockAt) console.log(`   Next unlock: ${result.nextUnlockAt}`);
    }
    printLine();
    break;
  }

  // ── VERIFY ──────────────────────────────────────────────
  case "verify": {
    printHeader("Blockchain Verification (Optional)");
    const rpcUrl  = process.env["AITCOIN_RPC_URL"]  ?? "";
    const rpcUser = process.env["AITCOIN_RPC_USER"] ?? "";
    const rpcPass = process.env["AITCOIN_RPC_PASS"] ?? "";
    if (!rpcUrl) {
      console.log("ℹ️  RPC not configured — set AITCOIN_RPC_URL in .env");
      console.log("   Wallet works offline without this step.");
    } else {
      console.log("Connecting to AITCOIN node...");
      const valid = await verifyViaBlockchain(rpcUrl, rpcUser, rpcPass);
      console.log(valid ? "✅ Wallet address verified on blockchain!" : "⚠️  Could not verify (node offline) — local data still valid.");
    }
    printLine();
    break;
  }

  default:
    printHeader("AITCOIN Wallet CLI");
    console.log("Usage: tsx src/wallet_cli.ts [command]");
    console.log("");
    console.log("Commands:");
    console.log("  init [address] [label]  — Initialize wallet (first time, no server)");
    console.log("  status                  — Check wallet status (offline)");
    console.log("  schedule                — View 39-month vesting schedule (offline)");
    console.log("  claim:free              — Claim 100K free ATC (offline)");
    console.log("  claim:vesting           — Claim available vesting (offline)");
    console.log("  verify                  — Verify via blockchain RPC (optional)");
    console.log("");
    console.log("All operations work OFFLINE after first init.");
    console.log("Server only needed for initial API registration.");
    printLine();
}
