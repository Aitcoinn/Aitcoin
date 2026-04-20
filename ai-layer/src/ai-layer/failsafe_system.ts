// ============================================================
// FAILSAFE_SYSTEM.TS — Emergency Stop & Auto-Isolation (#17)
// Perlindungan terakhir sistem
// AI bisa menghentikan dirinya sendiri atau fitur tertentu
// ============================================================

import { emit, reportAnomaly } from "./system_monitor.js";

export type FailsafeLevel = "NONE" | "THROTTLE" | "ISOLATE" | "EMERGENCY_STOP";

export interface FailsafeState {
  level:         FailsafeLevel;
  activatedAt?:  number;
  reason?:       string;
  activatedBy?:  string;
  isolatedModules: string[];
  throttledAgents: string[];
  autoResetAt?:  number;
}

export interface FailsafeEvent {
  at:      number;
  action:  "activate" | "deactivate" | "isolate" | "throttle" | "auto_reset";
  level:   FailsafeLevel;
  reason:  string;
  by:      string;
}

// ── State ─────────────────────────────────────────────────────
const state: FailsafeState = {
  level: "NONE",
  isolatedModules: [],
  throttledAgents: [],
};
const eventLog: FailsafeEvent[] = [];

function log(action: FailsafeEvent["action"], level: FailsafeLevel, reason: string, by: string) {
  eventLog.push({ at: Date.now(), action, level, reason, by });
  if (eventLog.length > 200) eventLog.shift();
}

// ── Activate failsafe ─────────────────────────────────────────
export function activateFailsafe(
  level:   FailsafeLevel,
  reason:  string,
  by:      string,
  autoResetMs?: number,
): void {
  if (level === "NONE") return;
  state.level       = level;
  state.activatedAt = Date.now();
  state.reason      = reason;
  state.activatedBy = by;
  if (autoResetMs) state.autoResetAt = Date.now() + autoResetMs;

  log("activate", level, reason, by);

  const severity = level === "EMERGENCY_STOP" ? "critical" : "warn";
  emit("health", severity, "failsafe",
    `Failsafe ACTIVATED [${level}]: ${reason}`, { by, autoResetMs });

  reportAnomaly("security", `Failsafe triggered: ${level} — ${reason}`, [by],
    level === "EMERGENCY_STOP" ? "critical" : "high");
}

// ── Deactivate failsafe ───────────────────────────────────────
export function deactivateFailsafe(by: string, reason: string): void {
  const prev = state.level;
  state.level       = "NONE";
  state.activatedAt = undefined;
  state.reason      = undefined;
  state.activatedBy = undefined;
  state.autoResetAt = undefined;
  log("deactivate", prev, reason, by);
  emit("health", "info", "failsafe", `Failsafe DEACTIVATED by ${by}: ${reason}`);
}

// ── Isolate a module ──────────────────────────────────────────
export function isolateModule(moduleName: string, reason: string, by: string): void {
  if (!state.isolatedModules.includes(moduleName)) {
    state.isolatedModules.push(moduleName);
    log("isolate", state.level, reason, by);
    emit("health", "warn", "failsafe", `Module isolated: ${moduleName}`, { reason, by });
  }
}

export function restoreModule(moduleName: string): void {
  state.isolatedModules = state.isolatedModules.filter(m => m !== moduleName);
  emit("health", "info", "failsafe", `Module restored: ${moduleName}`);
}

// ── Throttle an agent ─────────────────────────────────────────
export function throttleAgent(agentId: string, reason: string, by: string): void {
  if (!state.throttledAgents.includes(agentId)) {
    state.throttledAgents.push(agentId);
    log("throttle", state.level, reason, by);
    emit("health", "warn", "failsafe", `Agent throttled: ${agentId}`, { reason });
  }
}

export function unthrottleAgent(agentId: string): void {
  state.throttledAgents = state.throttledAgents.filter(a => a !== agentId);
}

// ── Check if action is allowed ────────────────────────────────
export function isActionAllowed(agentId: string, actionType: string): boolean {
  if (state.level === "EMERGENCY_STOP") return false;
  if (state.throttledAgents.includes(agentId)) return false;
  if (state.level === "ISOLATE" && actionType !== "observe") return false;
  if (state.level === "THROTTLE" && ["rule_change","module_add"].includes(actionType)) return false;
  // Auto-reset check
  if (state.autoResetAt && Date.now() > state.autoResetAt) {
    deactivateFailsafe("auto_reset", "Auto-reset timer expired");
  }
  return true;
}

export function isModuleIsolated(moduleName: string): boolean {
  return state.isolatedModules.includes(moduleName);
}

export function getFailsafeState(): FailsafeState { return { ...state }; }
export function getEventLog(limit = 50): FailsafeEvent[] { return eventLog.slice(-limit); }
export function isSystemSafe(): boolean { return state.level !== "EMERGENCY_STOP"; }
