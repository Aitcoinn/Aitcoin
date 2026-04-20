// ============================================================
// EVOLUTION_TRACKER.TS — Long-Term Evolution Tracking (#22)
// Melacak perkembangan AI dan sistem dari waktu ke waktu
// Mengukur apakah sistem semakin baik atau tidak
// ============================================================

import { emit } from "./system_monitor.js";

export interface EvolutionSnapshot {
  tick:             number;
  timestamp:        number;
  stabilityScore:   number;    // 0-1
  errorCount:       number;
  avgAgentScore:    number;
  activeAgents:     number;
  improvementsApplied: number;
  rollbackCount:    number;
  knowledgeEntries: number;
  consensusReached: number;
  notes:            string;
}

export interface EvolutionTrend {
  metric:        string;
  direction:     "improving" | "stable" | "degrading";
  change:        number;        // % change vs 10 snapshots ago
  confidence:    number;        // 0-1
}

// ── History ───────────────────────────────────────────────────
const history: EvolutionSnapshot[] = [];
const MAX_HISTORY = 1000;

export function recordSnapshot(snap: Omit<EvolutionSnapshot, "timestamp">): EvolutionSnapshot {
  const full: EvolutionSnapshot = { ...snap, timestamp: Date.now() };
  history.push(full);
  if (history.length > MAX_HISTORY) history.shift();
  return full;
}

// ── Calculate trends ──────────────────────────────────────────
export function analyzeTrends(windowSize = 10): EvolutionTrend[] {
  if (history.length < windowSize * 2) return [];
  const recent = history.slice(-windowSize);
  const prev   = history.slice(-windowSize * 2, -windowSize);

  const avg = (arr: EvolutionSnapshot[], key: keyof EvolutionSnapshot) =>
    arr.reduce((s, x) => s + (x[key] as number), 0) / arr.length;

  const metrics: Array<keyof EvolutionSnapshot> = [
    "stabilityScore", "avgAgentScore", "activeAgents",
    "improvementsApplied", "errorCount",
  ];

  return metrics.map(metric => {
    const recentAvg = avg(recent, metric);
    const prevAvg   = avg(prev, metric);
    const change    = prevAvg !== 0 ? ((recentAvg - prevAvg) / Math.abs(prevAvg)) * 100 : 0;
    const improving = metric === "errorCount" || metric === "rollbackCount"
      ? change < -2 : change > 2;
    const degrading = metric === "errorCount" || metric === "rollbackCount"
      ? change > 5 : change < -5;

    return {
      metric: metric as string,
      direction: improving ? "improving" : degrading ? "degrading" : "stable",
      change,
      confidence: Math.min(1, history.length / 100),
    };
  });
}

// ── Check if system is genuinely evolving ─────────────────────
export function getEvolutionScore(): number {
  const trends = analyzeTrends();
  if (trends.length === 0) return 0.5;
  const score = trends.reduce((s, t) => {
    if (t.direction === "improving") return s + 1;
    if (t.direction === "degrading") return s - 0.5;
    return s;
  }, 0);
  return Math.max(0, Math.min(1, (score + trends.length) / (trends.length * 2)));
}

export function getHistory(limit = 100): EvolutionSnapshot[] {
  return history.slice(-limit);
}

export function getSummary(): {
  totalSnapshots: number;
  evolutionScore:  number;
  trends:          EvolutionTrend[];
  firstRecordedAt?: number;
  latestStability?: number;
} {
  return {
    totalSnapshots:  history.length,
    evolutionScore:  getEvolutionScore(),
    trends:          analyzeTrends(),
    firstRecordedAt: history[0]?.timestamp,
    latestStability: history[history.length - 1]?.stabilityScore,
  };
}
