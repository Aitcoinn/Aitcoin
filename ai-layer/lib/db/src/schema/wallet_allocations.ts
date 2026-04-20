// ============================================================
// WALLET_ALLOCATIONS.TS — 4M ATC Development Fund Schema
// 100,000 ATC Free Immediately
// 3,900,000 ATC Vesting — 100,000 ATC unlocked per month (39 months)
// UPDATED: Monthly vesting schedule with claim tracking
// ============================================================

import { pgTable, serial, varchar, numeric, timestamp, boolean, integer, text } from "drizzle-orm/pg-core";

export const walletAllocationsTable = pgTable("wallet_allocations", {
  id:             serial("id").primaryKey(),
  walletAddress:  varchar("wallet_address", { length: 256 }).notNull().unique(),
  label:          varchar("label", { length: 128 }).notNull().default("default"),

  // ── Free Allocation: 100,000 ATC (immediately claimable) ──
  freeAmount:     numeric("free_amount",     { precision: 20, scale: 8 }).notNull().default("100000"),
  freeClaimed:    boolean("free_claimed").notNull().default(false),
  freeClaimedAt:  timestamp("free_claimed_at"),

  // ── Vesting Allocation: 3,900,000 ATC (100K/month for 39 months) ──
  vestingAmount:          numeric("vesting_amount",    { precision: 20, scale: 8 }).notNull().default("3900000"),
  vestingStartAt:         timestamp("vesting_start_at").notNull().defaultNow(),
  vestingUnlockAt:        timestamp("vesting_unlock_at").notNull(), // First month unlock date
  vestingMonthlyAmount:   numeric("vesting_monthly_amount", { precision: 20, scale: 8 }).notNull().default("100000"),
  vestingTotalMonths:     integer("vesting_total_months").notNull().default(39),
  vestingMonthsClaimed:   integer("vesting_months_claimed").notNull().default(0),
  vestingClaimed:         boolean("vesting_claimed").notNull().default(false), // true when all 39 months claimed
  vestingClaimedAt:       timestamp("vesting_claimed_at"), // timestamp of final (39th) claim

  // ── Status ───────────────────────────────────────────────
  totalAllocated:  numeric("total_allocated", { precision: 20, scale: 8 }).notNull().default("4000000"),
  totalClaimed:    numeric("total_claimed",   { precision: 20, scale: 8 }).notNull().default("0"),
  status:          varchar("status", { length: 32 }).notNull().default("active"),
  notes:           text("notes"),

  createdAt:  timestamp("created_at").notNull().defaultNow(),
  updatedAt:  timestamp("updated_at").notNull().defaultNow(),
});

export type WalletAllocation = typeof walletAllocationsTable.$inferSelect;
export type NewWalletAllocation = typeof walletAllocationsTable.$inferInsert;
