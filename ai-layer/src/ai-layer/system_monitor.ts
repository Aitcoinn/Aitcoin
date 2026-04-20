// ============================================================
// SYSTEM_MONITOR.TS — Real-time System Monitoring Layer (#1)
// Memantau ai_state, world, interaksi antar agent
// Mendeteksi error, bug, anomali, perilaku tidak normal
// Menyimpan log ke ai_memory
// ============================================================

import { logger } from "../lib/logger.js";

export interface SystemMetric {
  timestamp: number;
  category:  "performance" | "error" | "anomaly" | "health" | "agent" | "network";
  severity:  "info" | "warn" | "critical" | "fatal";
  source:    string;
  message:   string;
  data?:     Record<string, unknown>;
}

export interface SystemHealth {
  overall:          "HEALTHY" | "DEGRADED" | "CRITICAL" | "FAILED";
  agentCount:       number;
  activeAgentCount: number;
  errorRate:        number;         // errors per second
  avgResponseTime:  number;         // ms
  memoryUsageMB:    number;
  uptime:           number;         // seconds
  lastCheckAt:      number;
}

export interface AnomalyReport {
  id:          string;
  detectedAt:  number;
  type:        "behavioral" | "performance" | "security" | "crash";
  description: string;
  affectedIds: string[];
  severity:    "low" | "medium" | "high" | "critical";
  resolved:    boolean;
}

// ── In-memory ring buffer for metrics ────────────────────────
const MAX_METRICS    = 2000;
const metricsBuffer: SystemMetric[] = [];
const anomalies:     AnomalyReport[]  = [];
let   errorCount     = 0;
let   startTime      = Date.now();
let   monitorInterval: ReturnType<typeof setInterval> | null = null;

// ── Emit a metric ─────────────────────────────────────────────
export function emit(
  category: SystemMetric["category"],
  severity: SystemMetric["severity"],
  source:   string,
  message:  string,
  data?:    Record<string, unknown>,
): void {
  const m: SystemMetric = { timestamp: Date.now(), category, severity, source, message, data };
  metricsBuffer.push(m);
  if (metricsBuffer.length > MAX_METRICS) metricsBuffer.shift();
  if (severity === "warn")     logger.warn ({ source, message, data }, "[Monitor]");
  if (severity === "critical") logger.error({ source, message, data }, "[Monitor][CRITICAL]");
  if (severity === "fatal")    logger.fatal({ source, message, data }, "[Monitor][FATAL]");
  if (severity === "critical" || severity === "fatal") errorCount++;
}

// ── Register an anomaly ───────────────────────────────────────
export function reportAnomaly(
  type:        AnomalyReport["type"],
  description: string,
  affectedIds: string[],
  severity:    AnomalyReport["severity"],
): AnomalyReport {
  const report: AnomalyReport = {
    id:          `anomaly_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    detectedAt:  Date.now(),
    type, description, affectedIds, severity,
    resolved:    false,
  };
  anomalies.push(report);
  if (anomalies.length > 500) anomalies.shift();
  emit("anomaly", severity === "critical" ? "critical" : "warn",
    "anomaly_detector", `Anomaly detected: ${description}`, { type, affectedIds });
  return report;
}

export function resolveAnomaly(id: string): boolean {
  const a = anomalies.find(x => x.id === id);
  if (!a) return false;
  a.resolved = true;
  emit("anomaly", "info", "anomaly_detector", `Anomaly resolved: ${id}`);
  return true;
}

// ── Get current system health ─────────────────────────────────
export function getSystemHealth(agentCount = 0, activeAgentCount = 0): SystemHealth {
  const mem = process.memoryUsage();
  const uptimeSec = (Date.now() - startTime) / 1000;
  const recentErrors = metricsBuffer.filter(
    m => m.severity === "critical" && m.timestamp > Date.now() - 60_000
  ).length;
  const errorRate = recentErrors / Math.max(60, uptimeSec);
  const overall =
    errorRate > 2   ? "FAILED"   :
    errorRate > 0.5 ? "CRITICAL" :
    errorRate > 0.1 ? "DEGRADED" : "HEALTHY";

  return {
    overall,
    agentCount,
    activeAgentCount,
    errorRate,
    avgResponseTime: 0,
    memoryUsageMB:   mem.heapUsed / 1024 / 1024,
    uptime:          uptimeSec,
    lastCheckAt:     Date.now(),
  };
}

// ── Query metrics ─────────────────────────────────────────────
export function getRecentMetrics(limit = 100, category?: SystemMetric["category"]): SystemMetric[] {
  const filtered = category ? metricsBuffer.filter(m => m.category === category) : metricsBuffer;
  return filtered.slice(-limit);
}

export function getOpenAnomalies(): AnomalyReport[] {
  return anomalies.filter(a => !a.resolved);
}

export function getAllAnomalies(limit = 50): AnomalyReport[] {
  return anomalies.slice(-limit);
}

// ── Periodic heartbeat monitor ────────────────────────────────
export function startSystemMonitor(intervalMs = 30_000): void {
  if (monitorInterval) return;
  startTime = Date.now();
  monitorInterval = setInterval(() => {
    const health = getSystemHealth();
    emit("health", health.overall === "HEALTHY" ? "info" : "warn",
      "system_monitor", `Health check: ${health.overall}`,
      { memoryMB: health.memoryUsageMB.toFixed(1), errorRate: health.errorRate.toFixed(3) }
    );
    // Auto-report memory anomaly
    if (health.memoryUsageMB > 800) {
      reportAnomaly("performance", `High memory usage: ${health.memoryUsageMB.toFixed(0)}MB`,
        ["system"], "high");
    }
  }, intervalMs);
  emit("health", "info", "system_monitor", "System monitor started");
}

export function stopSystemMonitor(): void {
  if (monitorInterval) { clearInterval(monitorInterval); monitorInterval = null; }
}
