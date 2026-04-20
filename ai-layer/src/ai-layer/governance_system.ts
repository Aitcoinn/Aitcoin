// ============================================================
// GOVERNANCE_SYSTEM.TS — AI Hierarchy & Permission System (#9)
// Tier: Normal → Advanced → Core
// Semua AI tidak punya hak yang sama
// ============================================================

import { emit } from "./system_monitor.js";

export type AITier = "NORMAL" | "ADVANCED" | "CORE";
export type Permission =
  | "observe"        // Observe-only
  | "act"            // Normal actions
  | "self_improve"   // Limited self-improvement
  | "system_change"  // System parameter changes
  | "governance"     // Change governance rules
  | "emergency_stop";// Trigger failsafe

const TIER_PERMISSIONS: Record<AITier, Permission[]> = {
  NORMAL:   ["observe", "act"],
  ADVANCED: ["observe", "act", "self_improve"],
  CORE:     ["observe", "act", "self_improve", "system_change", "governance", "emergency_stop"],
};

const TIER_PROMOTION_THRESHOLD: Record<AITier, number> = {
  NORMAL:   0,
  ADVANCED: 70,  // reputation score >= 70
  CORE:     90,  // reputation score >= 90
};

export interface GovernanceRecord {
  agentId:       string;
  tier:          AITier;
  reputationScore: number;
  permissionsGranted: Permission[];
  promotedAt?:   number;
  demotedAt?:    number;
  history:       { at: number; from: AITier; to: AITier; reason: string }[];
}

// ── In-memory registry ────────────────────────────────────────
const registry = new Map<string, GovernanceRecord>();

export function registerAgent(agentId: string, initialReputation = 0): GovernanceRecord {
  if (registry.has(agentId)) return registry.get(agentId)!;
  const rec: GovernanceRecord = {
    agentId, tier: "NORMAL",
    reputationScore: initialReputation,
    permissionsGranted: [...TIER_PERMISSIONS.NORMAL],
    history: [],
  };
  registry.set(agentId, rec);
  return rec;
}

export function updateReputation(agentId: string, newScore: number): GovernanceRecord {
  let rec = registry.get(agentId);
  if (!rec) rec = registerAgent(agentId, newScore);
  const oldTier = rec.tier;
  rec.reputationScore = Math.max(0, Math.min(100, newScore));

  // Auto-promote / demote
  const newTier: AITier =
    rec.reputationScore >= TIER_PROMOTION_THRESHOLD.CORE     ? "CORE"     :
    rec.reputationScore >= TIER_PROMOTION_THRESHOLD.ADVANCED ? "ADVANCED" : "NORMAL";

  if (newTier !== oldTier) {
    rec.history.push({ at: Date.now(), from: oldTier, to: newTier,
      reason: `Reputation ${rec.reputationScore}` });
    rec.tier = newTier;
    rec.permissionsGranted = [...TIER_PERMISSIONS[newTier]];
    if (newTier > oldTier) rec.promotedAt = Date.now();
    else                   rec.demotedAt  = Date.now();
    emit("agent", "info", "governance",
      `Agent ${agentId} ${newTier > oldTier ? "promoted to" : "demoted to"} ${newTier}`,
      { oldTier, newTier, reputation: rec.reputationScore });
  }
  return rec;
}

export function hasPermission(agentId: string, perm: Permission): boolean {
  const rec = registry.get(agentId);
  if (!rec) return perm === "observe";
  return rec.permissionsGranted.includes(perm);
}

export function checkPermission(agentId: string, perm: Permission): void {
  if (!hasPermission(agentId, perm)) {
    throw new Error(`Agent ${agentId} (tier ${registry.get(agentId)?.tier ?? "UNKNOWN"}) lacks permission: ${perm}`);
  }
}

export function getRecord(agentId: string): GovernanceRecord | undefined {
  return registry.get(agentId);
}

export function getAllRecords(): GovernanceRecord[] {
  return [...registry.values()];
}

export function getCoreAgents(): GovernanceRecord[] {
  return [...registry.values()].filter(r => r.tier === "CORE");
}

export function getTierStats(): Record<AITier, number> {
  const counts: Record<AITier, number> = { NORMAL: 0, ADVANCED: 0, CORE: 0 };
  for (const rec of registry.values()) counts[rec.tier]++;
  return counts;
}
