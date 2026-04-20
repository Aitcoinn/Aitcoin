// ============================================================
// ANOMALY_DETECTOR.TS — Anomaly & Threat Detection (#14)
// Deteksi perilaku AI tidak normal
// Deteksi eksploitasi atau manipulasi
// ============================================================

import { emit, reportAnomaly, type AnomalyReport } from "./system_monitor.js";

export interface AgentBehaviorProfile {
  agentId:          string;
  avgActionsPerTick: number;
  avgEnergyChange:  number;
  typicalTraitRange: Record<string, [number, number]>; // [min, max]
  observedAt:       number;
  sampleCount:      number;
}

export interface DeviationEvent {
  agentId:    string;
  metric:     string;
  expected:   number;
  actual:     number;
  deviation:  number;   // sigma units
  detectedAt: number;
}

// ── Behavior baseline registry ────────────────────────────────
const profiles   = new Map<string, AgentBehaviorProfile>();
const deviations: DeviationEvent[] = [];
const DEVIATION_THRESHOLD = 3.0; // sigma

// ── Update/build baseline ─────────────────────────────────────
export function updateBaseline(
  agentId:      string,
  actionsPerTick: number,
  energyChange:   number,
  traits:         Record<string, number>,
): void {
  const p = profiles.get(agentId);
  if (!p) {
    const ranges: Record<string, [number, number]> = {};
    for (const [k, v] of Object.entries(traits)) ranges[k] = [v * 0.8, v * 1.2];
    profiles.set(agentId, {
      agentId, avgActionsPerTick: actionsPerTick,
      avgEnergyChange: energyChange,
      typicalTraitRange: ranges, observedAt: Date.now(), sampleCount: 1,
    });
    return;
  }
  // Exponential moving average
  const alpha = 0.1;
  p.avgActionsPerTick = p.avgActionsPerTick * (1 - alpha) + actionsPerTick * alpha;
  p.avgEnergyChange   = p.avgEnergyChange   * (1 - alpha) + energyChange   * alpha;
  for (const [k, v] of Object.entries(traits)) {
    if (!p.typicalTraitRange[k]) { p.typicalTraitRange[k] = [v * 0.8, v * 1.2]; continue; }
    const [lo, hi] = p.typicalTraitRange[k];
    p.typicalTraitRange[k] = [Math.min(lo, v) * (1 - alpha) + lo * alpha,
                               Math.max(hi, v) * (1 - alpha) + hi * alpha];
  }
  p.sampleCount++;
  p.observedAt = Date.now();
}

// ── Analyze agent for anomalies ───────────────────────────────
export function analyzeAgent(
  agentId:        string,
  actionsPerTick: number,
  energyChange:   number,
  traits:         Record<string, number>,
): AnomalyReport[] {
  const detected: AnomalyReport[] = [];
  const p = profiles.get(agentId);
  if (!p || p.sampleCount < 10) {
    // Not enough data yet
    updateBaseline(agentId, actionsPerTick, energyChange, traits);
    return [];
  }

  // Check action rate deviation
  const actionDev = Math.abs(actionsPerTick - p.avgActionsPerTick) /
    (Math.abs(p.avgActionsPerTick) + 0.001);
  if (actionDev > DEVIATION_THRESHOLD * 0.1) {
    deviations.push({ agentId, metric: "actionsPerTick",
      expected: p.avgActionsPerTick, actual: actionsPerTick,
      deviation: actionDev, detectedAt: Date.now() });
    if (actionDev > 5) {
      detected.push(reportAnomaly("behavioral",
        `Agent ${agentId} action rate spike: ${actionsPerTick.toFixed(1)} vs expected ${p.avgActionsPerTick.toFixed(1)}`,
        [agentId], "high"));
    }
  }

  // Check trait out-of-range
  for (const [k, v] of Object.entries(traits)) {
    const range = p.typicalTraitRange[k];
    if (!range) continue;
    if (v < range[0] * 0.5 || v > range[1] * 2) {
      detected.push(reportAnomaly("behavioral",
        `Agent ${agentId} trait "${k}" out of normal range: ${v.toFixed(3)} (expected [${range[0].toFixed(2)}, ${range[1].toFixed(2)}])`,
        [agentId], "medium"));
    }
  }

  updateBaseline(agentId, actionsPerTick, energyChange, traits);
  return detected;
}

// ── Detect system-wide threats ────────────────────────────────
export function detectSystemThreats(agentIds: string[]): AnomalyReport[] {
  const alerts: AnomalyReport[] = [];

  // Check for coordinated behavior (mob manipulation)
  const activeCount = agentIds.length;
  if (activeCount > 80) {
    alerts.push(reportAnomaly("security",
      `Unusual number of agents active simultaneously: ${activeCount}/100`,
      agentIds, "medium"));
  }

  // Check recent deviation spike
  const recentDevs = deviations.filter(d => d.detectedAt > Date.now() - 60_000);
  if (recentDevs.length > 20) {
    alerts.push(reportAnomaly("security",
      `High deviation event rate: ${recentDevs.length} events in last 60s`,
      [...new Set(recentDevs.map(d => d.agentId))], "high"));
  }

  return alerts;
}

export function getRecentDeviations(limit = 50): DeviationEvent[] {
  return deviations.slice(-limit);
}

export function getProfileCount(): number { return profiles.size; }
