// ============================================================
// SELF_EVOLUTION_ORCHESTRATOR.TS — Main Evolution Engine
// Alur utama: Monitor → Analyze → Decide → Modify → Validate → Deploy
// Mengintegrasikan semua 26 komponen sistem
// BATASAN: Hanya AI Layer — TIDAK menyentuh C++ blockchain
// ============================================================

import { logger }             from "../lib/logger.js";
import * as Monitor           from "./system_monitor.js";
import * as Sandbox           from "./sandbox_executor.js";
import * as VersionCtrl       from "./version_control.js";
import * as Governance        from "./governance_system.js";
import * as Anomaly           from "./anomaly_detector.js";
import * as Consensus         from "./multi_ai_consensus.js";
import * as Resource          from "./resource_manager.js";
import * as Knowledge         from "./knowledge_base.js";
import * as EvolutionTracker  from "./evolution_tracker.js";
import * as Failsafe          from "./failsafe_system.js";
import * as Goals             from "./goal_mission_system.js";
import * as MetaGov           from "./meta_governance.js";
import * as BlockchainObs     from "./blockchain_observer.js";

// External engines (existing)
import * as MetaCognition     from "./meta_cognition.js";
import * as Introspection     from "./introspection_engine.js";
import * as SelfImprovement   from "./self_improvement_engine.js";
import * as Mutation          from "./mutation_engine.js";
import * as Constraint        from "./constraint_system.js";
import * as Morality          from "./morality_engine.js";
import * as Values            from "./value_system.js";
import * as Reputation        from "./reputation_engine.js";
import * as Probability       from "./probability_engine.js";
import * as Entropy           from "./entropy_engine.js";
import * as Desire            from "./desire_engine.js";
import * as Ambition          from "./ambition_engine.js";

export interface EvolutionCycle {
  cycleId:     string;
  startedAt:   number;
  phase:       "MONITOR" | "ANALYZE" | "DECIDE" | "MODIFY" | "VALIDATE" | "DEPLOY" | "COMPLETE" | "ABORTED";
  decisions:   EvolutionDecision[];
  appliedCount: number;
  rejectedCount: number;
  completedAt?: number;
  error?:       string;
}

export interface EvolutionDecision {
  id:          string;
  type:        "trait_mutation" | "rule_change" | "param_adjust" | "knowledge_store" | "governance_update";
  description: string;
  agentId:     string;
  proposed:    Record<string, unknown>;
  sandboxResult?: { passed: boolean; stabilityScore: number };
  applied:     boolean;
  reason:      string;
}

export interface OrchestratorState {
  running:          boolean;
  cycleCount:       number;
  lastCycleAt:      number;
  currentCycleId?:  string;
  totalApplied:     number;
  totalRejected:    number;
  totalRollbacks:   number;
  improvementScore: number;  // 0-1, tracks net system improvement
}

// ── State ─────────────────────────────────────────────────────
const state: OrchestratorState = {
  running: false, cycleCount: 0, lastCycleAt: 0,
  totalApplied: 0, totalRejected: 0, totalRollbacks: 0,
  improvementScore: 0.5,
};
const cycleHistory: EvolutionCycle[] = [];
let   orchestratorInterval: ReturnType<typeof setInterval> | null = null;
let   tick = 0;

// ── PHASE 1: MONITOR ──────────────────────────────────────────
async function phaseMonitor(cycle: EvolutionCycle): Promise<void> {
  cycle.phase = "MONITOR";
  Monitor.emit("health", "info", "orchestrator", `[Cycle ${cycle.cycleId}] Phase: MONITOR`);

  // Observe blockchain state (read-only)
  try { await BlockchainObs.refreshBlockchainStatus(); } catch { /* non-critical */ }

  // Record evolution snapshot
  const health = Monitor.getSystemHealth();
  EvolutionTracker.recordSnapshot({
    tick,
    stabilityScore:    health.overall === "HEALTHY" ? 1 : health.overall === "DEGRADED" ? 0.6 : 0.2,
    errorCount:        Math.floor(health.errorRate * 60),
    avgAgentScore:     50,    // Will be populated by agent engine
    activeAgents:      health.activeAgentCount,
    improvementsApplied: state.totalApplied,
    rollbackCount:     state.totalRollbacks,
    knowledgeEntries:  Knowledge.getStats().total,
    consensusReached:  Consensus.getAllProposals(100).filter(p => p.result === "APPROVED").length,
    notes:             `Auto-cycle ${state.cycleCount}`,
  });

  // Detect threats and anomalies
  const threats = Anomaly.detectSystemThreats([]);
  if (threats.length > 0) {
    Monitor.emit("health", "warn", "orchestrator",
      `${threats.length} system threat(s) detected this cycle`);
  }

  // Check failsafe
  if (!Failsafe.isSystemSafe()) {
    cycle.phase = "ABORTED";
    cycle.error = "Failsafe EMERGENCY_STOP active";
    Monitor.emit("health", "warn", "orchestrator", "Cycle aborted — failsafe active");
    return;
  }

  // Update goal progress
  Goals.updateGoalProgress("knowledgeEntries", Knowledge.getStats().total);
  Goals.updateGoalProgress("improvementCycles", state.totalApplied);
}

// ── PHASE 2: ANALYZE ─────────────────────────────────────────
async function phaseAnalyze(cycle: EvolutionCycle): Promise<void> {
  cycle.phase = "ANALYZE";
  Monitor.emit("health", "info", "orchestrator", `[Cycle ${cycle.cycleId}] Phase: ANALYZE`);

  // Evolution tracking analysis
  const trends  = EvolutionTracker.analyzeTrends();
  const summary = EvolutionTracker.getSummary();

  // Adapt governance rules based on performance
  MetaGov.adaptRules({
    consensusSpeed:    600_000,  // TODO: measure real consensus time
    changeSuccessRate: summary.evolutionScore,
    systemStability:   summary.latestStability ?? 0.5,
  });

  // Store analysis findings in knowledge base
  if (trends.length > 0) {
    const degrading = trends.filter(t => t.direction === "degrading");
    if (degrading.length > 0) {
      Knowledge.store(
        "orchestrator",
        "system_analysis",
        "warning",
        `Degrading trends detected: ${degrading.map(t => t.metric).join(", ")}`,
        { trends: degrading, cycleId: cycle.cycleId },
        0.75,
      );
    }
  }

  // Check anomalies from monitor
  const openAnomalies = Monitor.getOpenAnomalies();
  if (openAnomalies.length > 5) {
    Failsafe.activateFailsafe("THROTTLE",
      `High anomaly count: ${openAnomalies.length} open anomalies`,
      "orchestrator", 15 * 60_000);
  }
}

// ── PHASE 3: DECIDE ───────────────────────────────────────────
async function phaseDecide(cycle: EvolutionCycle): Promise<void> {
  cycle.phase = "DECIDE";
  Monitor.emit("health", "info", "orchestrator", `[Cycle ${cycle.cycleId}] Phase: DECIDE`);

  const evolution = EvolutionTracker.getSummary();
  const blockchainRec = BlockchainObs.recommendAIBehavior();
  const decisions: EvolutionDecision[] = [];

  // Decision 1: Param adjustment if evolution score is low
  if (evolution.evolutionScore < 0.4) {
    decisions.push({
      id:          `dec_${Date.now()}_1`,
      type:        "param_adjust",
      description: "Lower mutation rate to improve stability",
      agentId:     "orchestrator",
      proposed:    { paramPath: "mutationRate", newValue: 0.005, oldValue: 0.01 },
      applied:     false,
      reason:      `Low evolution score: ${evolution.evolutionScore.toFixed(2)}`,
    });
  }

  // Decision 2: Reduce changes if blockchain says minimal mode
  if (blockchainRec.recommendedMode === "minimal" || blockchainRec.recommendedMode === "conservative") {
    decisions.push({
      id:          `dec_${Date.now()}_2`,
      type:        "param_adjust",
      description: `Adjust AI activity for blockchain mode: ${blockchainRec.recommendedMode}`,
      agentId:     "orchestrator",
      proposed:    { mode: blockchainRec.recommendedMode, reason: blockchainRec.reason },
      applied:     false,
      reason:      blockchainRec.description,
    });
  }

  // Decision 3: Knowledge pruning if KB is large
  const kbStats = Knowledge.getStats();
  if (kbStats.total > 400) {
    decisions.push({
      id:          `dec_${Date.now()}_3`,
      type:        "param_adjust",
      description: "Prune low-confidence knowledge entries",
      agentId:     "orchestrator",
      proposed:    { action: "prune_kb", minConfidence: 0.4 },
      applied:     false,
      reason:      `Knowledge base large: ${kbStats.total} entries`,
    });
  }

  cycle.decisions = decisions;
  Monitor.emit("health", "info", "orchestrator",
    `${decisions.length} evolution decision(s) proposed`);
}

// ── PHASE 4: MODIFY (with sandbox) ───────────────────────────
async function phaseModify(cycle: EvolutionCycle): Promise<void> {
  cycle.phase = "MODIFY";
  Monitor.emit("health", "info", "orchestrator", `[Cycle ${cycle.cycleId}] Phase: MODIFY`);

  for (const dec of cycle.decisions) {
    // Resource check
    if (!Resource.charge("orchestrator", "self_improve")) {
      dec.reason += " [BLOCKED: resource limit]";
      cycle.rejectedCount++;
      continue;
    }

    // Constraint check via validation_engine principles
    if (dec.proposed["action"] === "modify_blockchain_consensus") {
      dec.reason += " [BLOCKED: blockchain immutability constraint]";
      cycle.rejectedCount++;
      Monitor.emit("health", "warn", "orchestrator",
        `BLOCKED: Attempt to modify blockchain — constraint enforced`);
      continue;
    }

    // Submit to sandbox
    const sandboxChange = Sandbox.submitForSandbox({
      submittedBy: dec.agentId,
      type:        "param_adjust",
      description: dec.description,
      payload:     dec.proposed,
    });
    const result = await Sandbox.runSandboxTest(sandboxChange);
    dec.sandboxResult = { passed: result.passed, stabilityScore: result.stabilityScore };

    if (result.passed) {
      dec.applied = true;
      cycle.appliedCount++;
      state.totalApplied++;
      Monitor.emit("health", "info", "orchestrator",
        `Change applied: ${dec.description}`, { stability: result.stabilityScore });

      // Store successful change in knowledge base
      Knowledge.store(
        "orchestrator", dec.type, "optimization",
        `Successful change: ${dec.description}`,
        { sandboxResult: result, decision: dec }, 0.8,
      );
    } else {
      cycle.rejectedCount++;
      state.totalRejected++;
      Monitor.emit("health", "info", "orchestrator",
        `Change rejected by sandbox: ${dec.description}`, { reason: result.reason });
    }
  }
}

// ── PHASE 5: VALIDATE ─────────────────────────────────────────
async function phaseValidate(cycle: EvolutionCycle): Promise<void> {
  cycle.phase = "VALIDATE";
  Monitor.emit("health", "info", "orchestrator", `[Cycle ${cycle.cycleId}] Phase: VALIDATE`);

  // Final health check
  const health = Monitor.getSystemHealth();

  // If system degraded after changes → auto-rollback
  if (health.overall === "CRITICAL" || health.overall === "FAILED") {
    const snap = VersionCtrl.autoRollbackToLastStable(
      `Post-cycle health: ${health.overall}`
    );
    if (snap) {
      state.totalRollbacks++;
      Monitor.emit("health", "warn", "orchestrator",
        `Auto-rollback to v${snap.version} after degraded health`);
    }
  }

  // Expire old consensus proposals
  Consensus.expireOldProposals();
}

// ── PHASE 6: DEPLOY ───────────────────────────────────────────
async function phaseDeploy(cycle: EvolutionCycle): Promise<void> {
  cycle.phase = "DEPLOY";
  Monitor.emit("health", "info", "orchestrator", `[Cycle ${cycle.cycleId}] Phase: DEPLOY`);

  // Create version snapshot of current state
  const snap = VersionCtrl.createSnapshot(
    {
      cycleId:   cycle.cycleId,
      applied:   cycle.appliedCount,
      rejected:  cycle.rejectedCount,
      timestamp: Date.now(),
      goals:     Goals.getGoalProgress(),
    },
    "orchestrator",
    `End of evolution cycle ${state.cycleCount}`,
  );

  // Mark stable if no rollbacks
  if (state.totalRollbacks === 0 || cycle.appliedCount > cycle.rejectedCount) {
    VersionCtrl.markStable(snap.snapshotId);
  }

  cycle.phase       = "COMPLETE";
  cycle.completedAt = Date.now();

  // Update improvement score
  const trend = EvolutionTracker.getEvolutionScore();
  state.improvementScore = state.improvementScore * 0.9 + trend * 0.1;

  Monitor.emit("health", "info", "orchestrator",
    `[Cycle ${cycle.cycleId}] COMPLETE — applied: ${cycle.appliedCount}, rejected: ${cycle.rejectedCount}`,
    { improvementScore: state.improvementScore.toFixed(3) }
  );
}

// ── Full evolution cycle ──────────────────────────────────────
export async function runEvolutionCycle(): Promise<EvolutionCycle> {
  tick++;
  state.cycleCount++;
  state.lastCycleAt = Date.now();

  const cycle: EvolutionCycle = {
    cycleId:      `cyc_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    startedAt:    Date.now(),
    phase:        "MONITOR",
    decisions:    [],
    appliedCount: 0,
    rejectedCount: 0,
  };
  cycleHistory.push(cycle);
  if (cycleHistory.length > 200) cycleHistory.shift();
  state.currentCycleId = cycle.cycleId;

  try {
    await phaseMonitor(cycle);
    if (cycle.phase === "ABORTED") return cycle;

    await phaseAnalyze(cycle);
    await phaseDecide(cycle);
    await phaseModify(cycle);
    await phaseValidate(cycle);
    await phaseDeploy(cycle);
  } catch (err) {
    cycle.phase  = "ABORTED";
    cycle.error  = String(err);
    Monitor.emit("health", "critical", "orchestrator",
      `Cycle ABORTED with error: ${cycle.error}`);
    logger.error({ err, cycleId: cycle.cycleId }, "[Orchestrator] Cycle error");
  }

  return cycle;
}

// ── Start/stop autonomous evolution ──────────────────────────
export function startOrchestrator(intervalMs = 60_000): void {
  if (orchestratorInterval) return;
  state.running = true;

  // Start sub-systems
  Monitor.startSystemMonitor(30_000);
  Governance.registerAgent("orchestrator", 100); // Core tier for orchestrator

  Monitor.emit("health", "info", "orchestrator",
    `Self-Evolution Orchestrator started (interval: ${intervalMs}ms)`);
  logger.info({ intervalMs }, "[Orchestrator] Self-evolving AI system started");

  // Run first cycle immediately then on interval
  void runEvolutionCycle();
  orchestratorInterval = setInterval(() => { void runEvolutionCycle(); }, intervalMs);
}

export function stopOrchestrator(): void {
  if (orchestratorInterval) { clearInterval(orchestratorInterval); orchestratorInterval = null; }
  state.running = false;
  Monitor.stopSystemMonitor();
  Monitor.emit("health", "info", "orchestrator", "Orchestrator stopped");
}

// ── Query ─────────────────────────────────────────────────────
export function getOrchestratorState(): OrchestratorState { return { ...state }; }
export function getCycleHistory(limit = 20): EvolutionCycle[] { return cycleHistory.slice(-limit); }
export function getSystemDashboard() {
  return {
    orchestrator:  state,
    health:        Monitor.getSystemHealth(),
    goals:         Goals.getGoalProgress(),
    evolution:     EvolutionTracker.getSummary(),
    knowledge:     Knowledge.getStats(),
    governance:    Governance.getTierStats(),
    openAnomalies: Monitor.getOpenAnomalies().length,
    openProposals: Consensus.getOpenProposals().length,
    failsafe:      Failsafe.getFailsafeState(),
    blockchain:    BlockchainObs.getObservedStatus(),
    resources:     Resource.getSystemResourceSummary(),
    version:       VersionCtrl.getCurrentVersion(),
  };
}
