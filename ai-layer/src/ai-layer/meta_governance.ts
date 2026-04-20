// ============================================================
// META_GOVERNANCE.TS — Evolusi Aturan Governance (#23)
// Governance rules bisa dievaluasi dan disesuaikan
// Sistem tidak kaku — mampu beradaptasi
// ============================================================

import { emit } from "./system_monitor.js";

export interface GovernanceRule {
  id:           string;
  name:         string;
  description:  string;
  category:     "voting" | "permissions" | "resource" | "consensus" | "security";
  currentValue: unknown;
  defaultValue: unknown;
  minValue?:    number;
  maxValue?:    number;
  lastModified: number;
  modifiedBy:   string;
  reason:       string;
  history:      { at: number; oldVal: unknown; newVal: unknown; by: string; reason: string }[];
}

export interface GovernanceEvaluation {
  ruleId:       string;
  evaluatedAt:  number;
  isEffective:  boolean;
  efficiency:   number;   // 0-1
  recommendation?: string;
  suggestedValue?: unknown;
}

// ── Default governance rules ──────────────────────────────────
const rules = new Map<string, GovernanceRule>([
  ["consensus_threshold", {
    id: "consensus_threshold", name: "Consensus Threshold",
    description: "Fraction of weighted votes needed to approve a proposal",
    category: "consensus", currentValue: 0.6, defaultValue: 0.6,
    minValue: 0.5, maxValue: 0.9, lastModified: Date.now(),
    modifiedBy: "system", reason: "Default", history: [],
  }],
  ["consensus_min_voters", {
    id: "consensus_min_voters", name: "Minimum Voters",
    description: "Minimum number of voters required for a proposal",
    category: "consensus", currentValue: 3, defaultValue: 3,
    minValue: 1, maxValue: 20, lastModified: Date.now(),
    modifiedBy: "system", reason: "Default", history: [],
  }],
  ["promotion_threshold_advanced", {
    id: "promotion_threshold_advanced", name: "Advanced Tier Threshold",
    description: "Reputation score needed to become ADVANCED",
    category: "permissions", currentValue: 70, defaultValue: 70,
    minValue: 50, maxValue: 90, lastModified: Date.now(),
    modifiedBy: "system", reason: "Default", history: [],
  }],
  ["promotion_threshold_core", {
    id: "promotion_threshold_core", name: "Core Tier Threshold",
    description: "Reputation score needed to become CORE",
    category: "permissions", currentValue: 90, defaultValue: 90,
    minValue: 80, maxValue: 99, lastModified: Date.now(),
    modifiedBy: "system", reason: "Default", history: [],
  }],
  ["max_changes_per_hour", {
    id: "max_changes_per_hour", name: "Max Changes Per Hour",
    description: "Maximum system changes an agent can make per hour",
    category: "resource", currentValue: 5, defaultValue: 5,
    minValue: 1, maxValue: 50, lastModified: Date.now(),
    modifiedBy: "system", reason: "Default", history: [],
  }],
  ["sandbox_stability_threshold", {
    id: "sandbox_stability_threshold", name: "Sandbox Stability Threshold",
    description: "Minimum stability score for a change to pass sandbox",
    category: "security", currentValue: 0.6, defaultValue: 0.6,
    minValue: 0.3, maxValue: 0.95, lastModified: Date.now(),
    modifiedBy: "system", reason: "Default", history: [],
  }],
]);

// ── Get rule value ────────────────────────────────────────────
export function getRuleValue<T = unknown>(ruleId: string): T | undefined {
  return rules.get(ruleId)?.currentValue as T | undefined;
}

// ── Modify rule (requires CORE tier caller) ───────────────────
export function modifyRule(
  ruleId:   string,
  newValue: unknown,
  modifiedBy: string,
  reason:   string,
): { success: boolean; message: string } {
  const rule = rules.get(ruleId);
  if (!rule) return { success: false, message: `Rule not found: ${ruleId}` };

  // Validate range
  if (typeof newValue === "number" && typeof rule.minValue === "number" && typeof rule.maxValue === "number") {
    if (newValue < rule.minValue || newValue > rule.maxValue) {
      return { success: false, message: `Value ${newValue} out of range [${rule.minValue}, ${rule.maxValue}]` };
    }
  }

  rule.history.push({ at: Date.now(), oldVal: rule.currentValue, newVal: newValue, by: modifiedBy, reason });
  rule.currentValue = newValue;
  rule.lastModified = Date.now();
  rule.modifiedBy   = modifiedBy;
  rule.reason       = reason;

  emit("health", "info", "meta_governance",
    `Rule modified: ${rule.name} = ${JSON.stringify(newValue)}`, { by: modifiedBy, reason });
  return { success: true, message: `Rule updated successfully` };
}

// ── Auto-adapt rules based on system performance ──────────────
export function adaptRules(metrics: {
  consensusSpeed: number;    // avg ms to reach consensus
  changeSuccessRate: number; // % of changes that are beneficial
  systemStability: number;   // 0-1
}): GovernanceEvaluation[] {
  const evals: GovernanceEvaluation[] = [];

  // If consensus too slow → lower threshold slightly
  if (metrics.consensusSpeed > 3_600_000) { // > 1 hour
    evals.push({
      ruleId: "consensus_threshold", evaluatedAt: Date.now(), isEffective: false,
      efficiency: 0.3,
      recommendation: "Consensus taking too long — consider lowering threshold",
      suggestedValue: Math.max(0.5, (getRuleValue<number>("consensus_threshold") ?? 0.6) - 0.05),
    });
  }

  // If change success rate low → increase stability threshold
  if (metrics.changeSuccessRate < 0.5) {
    evals.push({
      ruleId: "sandbox_stability_threshold", evaluatedAt: Date.now(), isEffective: false,
      efficiency: 0.4,
      recommendation: "Too many unstable changes — increase sandbox threshold",
      suggestedValue: Math.min(0.9, (getRuleValue<number>("sandbox_stability_threshold") ?? 0.6) + 0.05),
    });
  }

  for (const e of evals) {
    emit("health", "info", "meta_governance",
      `Rule adaptation: ${e.ruleId} — ${e.recommendation}`, { suggestedValue: e.suggestedValue });
  }
  return evals;
}

export function getAllRules(): GovernanceRule[] { return [...rules.values()]; }
export function getRuleHistory(ruleId: string) { return rules.get(ruleId)?.history ?? []; }
export function resetRule(ruleId: string, by: string): boolean {
  const rule = rules.get(ruleId);
  if (!rule) return false;
  return modifyRule(ruleId, rule.defaultValue, by, "Reset to default").success;
}
