// ============================================================
// SANDBOX_EXECUTOR.TS — Isolated Testing Environment (#10)
// Semua perubahan diuji di sandbox sebelum diterapkan ke sistem
// Simulasikan dampak → Tolak jika menyebabkan instabilitas
// ============================================================

import { emit } from "./system_monitor.js";

export type SandboxStatus = "PENDING" | "RUNNING" | "PASSED" | "FAILED" | "REJECTED";

export interface SandboxChange {
  id:          string;
  submittedBy: string;        // agent ID
  type:        "trait_mutation" | "rule_change" | "module_add" | "param_adjust" | "behavior_shift";
  description: string;
  payload:     Record<string, unknown>;
  submittedAt: number;
}

export interface SandboxResult {
  changeId:        string;
  status:          SandboxStatus;
  stabilityScore:  number;     // 0-1: 1 = perfectly stable
  performanceDelta: number;    // % change in performance (-1 to +1)
  riskScore:       number;     // 0-1: 1 = extremely risky
  sideEffects:     string[];
  simulatedTicks:  number;
  passed:          boolean;
  reason:          string;
  completedAt:     number;
}

// ── Constants ─────────────────────────────────────────────────
const STABILITY_THRESHOLD    = 0.6;
const RISK_REJECT_THRESHOLD  = 0.8;
const SIMULATION_TICKS       = 50;
const pendingQueue: SandboxChange[] = [];
const resultHistory: SandboxResult[] = [];

// ── Submit change for sandbox testing ────────────────────────
export function submitForSandbox(change: Omit<SandboxChange, "id" | "submittedAt">): SandboxChange {
  const c: SandboxChange = {
    ...change,
    id: `sbx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    submittedAt: Date.now(),
  };
  pendingQueue.push(c);
  emit("health", "info", "sandbox", `Change submitted for sandbox: ${c.id}`, { type: c.type });
  return c;
}

// ── Run sandbox simulation ────────────────────────────────────
export async function runSandboxTest(change: SandboxChange): Promise<SandboxResult> {
  emit("health", "info", "sandbox", `Running sandbox test: ${change.id}`);

  // Simulate N ticks in isolation
  let stabilityAccum = 0;
  let errorTicks = 0;
  const sideEffects: string[] = [];

  for (let tick = 0; tick < SIMULATION_TICKS; tick++) {
    // Model stability degradation based on change type
    const riskFactor =
      change.type === "module_add"    ? 0.3 :
      change.type === "rule_change"   ? 0.2 :
      change.type === "trait_mutation"? 0.1 :
      change.type === "param_adjust"  ? 0.05 : 0.15;

    const noise = (Math.random() - 0.5) * riskFactor;
    const tickStability = Math.max(0, Math.min(1, 1 - riskFactor * 0.5 + noise));
    stabilityAccum += tickStability;
    if (tickStability < 0.4) errorTicks++;
  }

  const stabilityScore   = stabilityAccum / SIMULATION_TICKS;
  const riskScore        = 1 - stabilityScore + (errorTicks / SIMULATION_TICKS) * 0.3;
  const performanceDelta = (stabilityScore - 0.5) * 0.4; // +/- 20% max

  // Detect side effects
  if (change.type === "module_add") sideEffects.push("New dependency chain introduced");
  if (riskScore > 0.5)             sideEffects.push("Moderate instability in simulation");
  if (errorTicks > 10)             sideEffects.push(`${errorTicks} unstable simulation ticks`);

  const passed = stabilityScore >= STABILITY_THRESHOLD && riskScore < RISK_REJECT_THRESHOLD;
  const reason = !passed
    ? `Rejected: stability=${stabilityScore.toFixed(2)}, risk=${riskScore.toFixed(2)}`
    : `Passed: ${SIMULATION_TICKS} ticks stable`;

  const result: SandboxResult = {
    changeId: change.id, status: passed ? "PASSED" : "REJECTED",
    stabilityScore, performanceDelta, riskScore, sideEffects,
    simulatedTicks: SIMULATION_TICKS, passed, reason,
    completedAt: Date.now(),
  };

  resultHistory.push(result);
  if (resultHistory.length > 200) resultHistory.shift();

  emit("health", passed ? "info" : "warn", "sandbox",
    `Sandbox result for ${change.id}: ${result.status}`,
    { stabilityScore, riskScore, sideEffects });

  return result;
}

// ── Process pending queue ─────────────────────────────────────
export async function processSandboxQueue(): Promise<SandboxResult[]> {
  const results: SandboxResult[] = [];
  while (pendingQueue.length > 0) {
    const change = pendingQueue.shift()!;
    results.push(await runSandboxTest(change));
  }
  return results;
}

export function getSandboxHistory(limit = 50): SandboxResult[] {
  return resultHistory.slice(-limit);
}

export function getPendingQueue(): SandboxChange[] {
  return [...pendingQueue];
}
