-- ============================================================
-- MIGRATION 001 — Update wallet_allocations for monthly vesting
-- Run this ONCE before deploying the new AI layer version
-- ============================================================

-- Add new vesting columns (safe to run — uses IF NOT EXISTS / DEFAULT)
ALTER TABLE wallet_allocations
  -- New: monthly vesting tracking
  ADD COLUMN IF NOT EXISTS vesting_monthly_amount  NUMERIC(20,8)  NOT NULL DEFAULT 100000,
  ADD COLUMN IF NOT EXISTS vesting_total_months    INTEGER        NOT NULL DEFAULT 39,
  ADD COLUMN IF NOT EXISTS vesting_months_claimed  INTEGER        NOT NULL DEFAULT 0;

-- Fix existing records: adjust amounts to new schedule
-- (Only runs if table has old-style 2M/2M allocations)
UPDATE wallet_allocations
SET
  free_amount            = 100000,
  vesting_amount         = 3900000,
  vesting_monthly_amount = 100000,
  vesting_total_months   = 39,
  total_allocated        = 4000000
WHERE
  free_amount     = 2000000
  AND vesting_amount = 2000000;

-- Remove old unlock_at if it no longer applies (keep column for first-month reference)
-- Note: vesting_unlock_at now means "date when first 100K becomes claimable"
UPDATE wallet_allocations
SET vesting_unlock_at = vesting_start_at + INTERVAL '30 days'
WHERE vesting_months_claimed = 0 AND NOT vesting_claimed;
