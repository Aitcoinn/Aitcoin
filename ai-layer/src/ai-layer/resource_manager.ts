// ============================================================
// RESOURCE_MANAGER.TS — Resource & Cost Awareness System (#25)
// Batasi frekuensi perubahan, track resource usage
// AI memilih solusi paling efisien
// ============================================================

import { emit } from "./system_monitor.js";

export interface ResourceBudget {
  agentId:           string;
  cpuUnitsPerMin:    number;   // allocated CPU units/min
  memoryMB:          number;   // allocated memory
  actionsPerMin:     number;   // max actions
  changesPerHour:    number;   // max system changes
  usedCpuUnits:      number;
  usedActions:       number;
  usedChanges:       number;
  windowStart:       number;   // ms timestamp
  totalCostAccum:    number;
}

export interface ActionCost {
  type:      string;
  cpuUnits:  number;
  memoryMB:  number;
  isChange:  boolean;
}

const ACTION_COSTS: Record<string, ActionCost> = {
  observe:         { type: "observe",         cpuUnits: 0.1, memoryMB: 0.1, isChange: false },
  interact:        { type: "interact",        cpuUnits: 0.5, memoryMB: 0.2, isChange: false },
  self_improve:    { type: "self_improve",    cpuUnits: 2.0, memoryMB: 1.0, isChange: true  },
  trait_mutation:  { type: "trait_mutation",  cpuUnits: 1.0, memoryMB: 0.5, isChange: true  },
  rule_change:     { type: "rule_change",     cpuUnits: 5.0, memoryMB: 2.0, isChange: true  },
  module_add:      { type: "module_add",      cpuUnits:10.0, memoryMB: 5.0, isChange: true  },
  sandbox_test:    { type: "sandbox_test",    cpuUnits: 3.0, memoryMB: 2.0, isChange: false },
  consensus_vote:  { type: "consensus_vote",  cpuUnits: 0.2, memoryMB: 0.1, isChange: false },
};

const DEFAULT_BUDGET: Omit<ResourceBudget, "agentId" | "windowStart"> = {
  cpuUnitsPerMin: 20, memoryMB: 50, actionsPerMin: 30, changesPerHour: 5,
  usedCpuUnits: 0, usedActions: 0, usedChanges: 0, totalCostAccum: 0,
};

const budgets = new Map<string, ResourceBudget>();

function getBudget(agentId: string): ResourceBudget {
  if (!budgets.has(agentId)) {
    budgets.set(agentId, { ...DEFAULT_BUDGET, agentId, windowStart: Date.now() });
  }
  return budgets.get(agentId)!;
}

function resetWindowIfNeeded(b: ResourceBudget): void {
  const elapsed = Date.now() - b.windowStart;
  if (elapsed >= 60_000) {
    b.usedCpuUnits = 0;
    b.usedActions  = 0;
    if (elapsed >= 3_600_000) b.usedChanges = 0;
    b.windowStart  = Date.now();
  }
}

// ── Check if agent can afford an action ──────────────────────
export function canAfford(agentId: string, actionType: string): boolean {
  const b    = getBudget(agentId);
  const cost = ACTION_COSTS[actionType] ?? ACTION_COSTS.interact;
  resetWindowIfNeeded(b);

  if (b.usedCpuUnits + cost.cpuUnits > b.cpuUnitsPerMin)  return false;
  if (b.usedActions + 1 > b.actionsPerMin)                 return false;
  if (cost.isChange && b.usedChanges + 1 > b.changesPerHour) return false;
  return true;
}

// ── Charge for an action ──────────────────────────────────────
export function charge(agentId: string, actionType: string): boolean {
  if (!canAfford(agentId, actionType)) {
    emit("health", "warn", "resource_manager",
      `Agent ${agentId} rate-limited for action: ${actionType}`);
    return false;
  }
  const b    = getBudget(agentId);
  const cost = ACTION_COSTS[actionType] ?? ACTION_COSTS.interact;
  resetWindowIfNeeded(b);
  b.usedCpuUnits     += cost.cpuUnits;
  b.usedActions      += 1;
  b.totalCostAccum   += cost.cpuUnits;
  if (cost.isChange) b.usedChanges += 1;
  return true;
}

export function getBudgetStatus(agentId: string): ResourceBudget {
  const b = getBudget(agentId);
  resetWindowIfNeeded(b);
  return { ...b };
}

export function getSystemResourceSummary(): {
  totalAgents: number; totalCostAccum: number; topConsumers: { id: string; cost: number }[]
} {
  const all = [...budgets.entries()].map(([id, b]) => ({ id, cost: b.totalCostAccum }));
  all.sort((a, b) => b.cost - a.cost);
  return {
    totalAgents:    all.length,
    totalCostAccum: all.reduce((s, x) => s + x.cost, 0),
    topConsumers:   all.slice(0, 5),
  };
}

export function getActionCosts(): ActionCost[] {
  return Object.values(ACTION_COSTS);
}
