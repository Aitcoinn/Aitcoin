// ============================================================
// WALLET.TS — 4M ATC Development Fund Allocation System
// 100,000 ATC  → Free, immediately claimable at genesis
// 3,900,000 ATC → Vesting, unlocks 100,000 ATC per month (39 months)
// UPDATED: Monthly vesting schedule
// ============================================================

import { db, isDbAvailable } from "../../lib/db/src/index.js";
import { walletAllocationsTable, type WalletAllocation } from "../../lib/db/src/index.js";
import { eq } from "drizzle-orm";

const FREE_AMOUNT          = "100000";    // 100K ATC immediately available
const VESTING_TOTAL        = "3900000";   // 3.9M ATC locked in vesting
const MONTHLY_AMOUNT       = "100000";    // 100K ATC released per month
const VESTING_TOTAL_MONTHS = 39;          // 39 months × 100K = 3.9M
const ONE_MONTH_MS         = 30 * 24 * 60 * 60 * 1000; // ~30 days per month

// FIX: Validate wallet address format (no-DB injection protection)
function validateWalletAddress(addr: string): boolean {
  if (!addr || addr.length < 10 || addr.length > 256) return false;
  return /^[a-zA-Z0-9_\-.:]+$/.test(addr);
}

// ── GUARD: DB required for wallet operations ─────────────────
function requireDb(): void {
  if (!isDbAvailable()) {
    throw new Error("Database not available — wallet operations require DATABASE_URL");
  }
}

// ── CREATE WALLET ALLOCATION — Buat alokasi 4M ATC ──────────
export async function createWalletAllocation(
  walletAddress: string,
  label = "default",
  notes?: string,
): Promise<WalletAllocation> {
  requireDb();
  if (!validateWalletAddress(walletAddress)) {
    throw new Error("Invalid wallet address format");
  }

  const existing = await db
    .select()
    .from(walletAllocationsTable)
    .where(eq(walletAllocationsTable.walletAddress, walletAddress))
    .limit(1);

  if (existing[0]) return existing[0];

  const now        = new Date();
  const firstUnlock = new Date(now.getTime() + ONE_MONTH_MS); // First 100K unlocks after 1 month

  const [allocation] = await db
    .insert(walletAllocationsTable)
    .values({
      walletAddress,
      label:                 label.slice(0, 128),
      freeAmount:            FREE_AMOUNT,
      freeClaimed:           false,
      vestingAmount:         VESTING_TOTAL,
      vestingStartAt:        now,
      vestingUnlockAt:       firstUnlock,
      vestingMonthlyAmount:  MONTHLY_AMOUNT,
      vestingTotalMonths:    VESTING_TOTAL_MONTHS,
      vestingMonthsClaimed:  0,
      vestingClaimed:        false,
      totalAllocated:        "4000000",
      totalClaimed:          "0",
      status:                "active",
      notes:                 notes ? notes.slice(0, 500) : null,
    })
    .returning();

  return allocation;
}

// ── CLAIM FREE — Klaim 100K ATC bebas ────────────────────────
export async function claimFreeAllocation(
  walletAddress: string,
): Promise<{ success: boolean; amount: string; message: string }> {
  requireDb();
  if (!validateWalletAddress(walletAddress)) {
    return { success: false, amount: "0", message: "Invalid wallet address format" };
  }

  const rows = await db
    .select()
    .from(walletAllocationsTable)
    .where(eq(walletAllocationsTable.walletAddress, walletAddress))
    .limit(1);

  const alloc = rows[0];
  if (!alloc)            return { success: false, amount: "0", message: "Wallet not registered for allocation" };
  if (alloc.freeClaimed) return { success: false, amount: "0", message: "Free allocation already claimed" };

  const now      = new Date();
  const newTotal = (parseFloat(alloc.totalClaimed ?? "0") + parseFloat(FREE_AMOUNT)).toString();

  await db.update(walletAllocationsTable).set({
    freeClaimed:   true,
    freeClaimedAt: now,
    totalClaimed:  newTotal,
    updatedAt:     now,
  }).where(eq(walletAllocationsTable.walletAddress, walletAddress));

  return {
    success: true,
    amount:  FREE_AMOUNT,
    message: `${FREE_AMOUNT} ATC (100,000 koin) free allocation claimed successfully`,
  };
}

// ── CLAIM VESTING MONTHLY — Klaim 100K ATC per bulan ─────────
export async function claimVestingAllocation(
  walletAddress: string,
): Promise<{
  success:   boolean;
  amount:    string;
  message:   string;
  claimedMonths?:    number;
  remainingMonths?:  number;
  nextUnlockAt?:     Date;
}> {
  requireDb();
  if (!validateWalletAddress(walletAddress)) {
    return { success: false, amount: "0", message: "Invalid wallet address format" };
  }

  const rows = await db
    .select()
    .from(walletAllocationsTable)
    .where(eq(walletAllocationsTable.walletAddress, walletAddress))
    .limit(1);

  const alloc = rows[0];
  if (!alloc) return { success: false, amount: "0", message: "Wallet not registered for allocation" };
  if (alloc.vestingClaimed) return { success: false, amount: "0", message: "All vesting months have been claimed (39/39)" };

  const now            = new Date();
  const startAt        = alloc.vestingStartAt ? new Date(alloc.vestingStartAt) : now;
  const monthsClaimed  = alloc.vestingMonthsClaimed ?? 0;
  const totalMonths    = alloc.vestingTotalMonths ?? VESTING_TOTAL_MONTHS;

  // How many months have elapsed since vesting start?
  const elapsedMs      = now.getTime() - startAt.getTime();
  const monthsElapsed  = Math.floor(elapsedMs / ONE_MONTH_MS);
  const claimableMonths = Math.min(monthsElapsed, totalMonths);
  const availableToClaimNow = claimableMonths - monthsClaimed;

  if (availableToClaimNow <= 0) {
    const nextUnlockAt = new Date(startAt.getTime() + (monthsClaimed + 1) * ONE_MONTH_MS);
    return {
      success:         false,
      amount:          "0",
      message:         `No vesting unlocked yet. Claimed: ${monthsClaimed}/${totalMonths} months. Next unlock at ${nextUnlockAt.toISOString()}`,
      claimedMonths:   monthsClaimed,
      remainingMonths: totalMonths - monthsClaimed,
      nextUnlockAt,
    };
  }

  // Claim ONE month at a time (or all available at once — here we claim all available)
  const amountToClaim = availableToClaimNow * parseFloat(MONTHLY_AMOUNT);
  const newMonthsClaimed = monthsClaimed + availableToClaimNow;
  const allFullyClaimed  = newMonthsClaimed >= totalMonths;
  const newTotal = (parseFloat(alloc.totalClaimed ?? "0") + amountToClaim).toString();

  await db.update(walletAllocationsTable).set({
    vestingMonthsClaimed: newMonthsClaimed,
    vestingClaimed:       allFullyClaimed,
    vestingClaimedAt:     allFullyClaimed ? now : null,
    totalClaimed:         newTotal,
    updatedAt:            now,
  }).where(eq(walletAllocationsTable.walletAddress, walletAddress));

  const remainingMonths = totalMonths - newMonthsClaimed;
  const nextUnlockAt    = remainingMonths > 0
    ? new Date(startAt.getTime() + (newMonthsClaimed + 1) * ONE_MONTH_MS)
    : undefined;

  return {
    success:         true,
    amount:          amountToClaim.toString(),
    message:         `${amountToClaim.toLocaleString()} ATC vesting claimed (${availableToClaimNow} month${availableToClaimNow > 1 ? "s" : ""}). Total claimed: ${newMonthsClaimed}/${totalMonths} months.`,
    claimedMonths:   newMonthsClaimed,
    remainingMonths,
    nextUnlockAt,
  };
}

// ── GET VESTING SCHEDULE — Lihat jadwal lengkap ────────────────
export function getVestingSchedule(vestingStartAt: Date): Array<{
  month:     number;
  unlockAt:  Date;
  amount:    number;
  cumulative: number;
}> {
  const schedule = [];
  for (let m = 1; m <= VESTING_TOTAL_MONTHS; m++) {
    const unlockAt  = new Date(vestingStartAt.getTime() + m * ONE_MONTH_MS);
    schedule.push({
      month:      m,
      unlockAt,
      amount:     100000,
      cumulative: m * 100000,
    });
  }
  return schedule;
}

// ── GET ALLOCATION STATUS ─────────────────────────────────────
export async function getAllocationStatus(walletAddress: string): Promise<WalletAllocation | null> {
  requireDb();
  if (!validateWalletAddress(walletAddress)) return null;

  const rows = await db
    .select()
    .from(walletAllocationsTable)
    .where(eq(walletAllocationsTable.walletAddress, walletAddress))
    .limit(1);

  return rows[0] ?? null;
}

// ── GET ALL ALLOCATIONS ───────────────────────────────────────
export async function getAllAllocations(): Promise<WalletAllocation[]> {
  requireDb();
  return db.select().from(walletAllocationsTable);
}
