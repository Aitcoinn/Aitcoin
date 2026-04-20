// ============================================================
// ROUTES/EVOLUTION.TS — REST API for Self-Evolving AI System
// All endpoints are read-only or action-gated
// BLOCKCHAIN LAYER IS NOT ACCESSIBLE FROM THESE ROUTES
// ============================================================

import { Router }    from "express";
import * as Orch     from "../ai-layer/self_evolution_orchestrator.js";
import * as Monitor  from "../ai-layer/system_monitor.js";
import * as Sandbox  from "../ai-layer/sandbox_executor.js";
import * as VerCtrl  from "../ai-layer/version_control.js";
import * as Gov      from "../ai-layer/governance_system.js";
import * as Anomaly  from "../ai-layer/anomaly_detector.js";
import * as Consensus from "../ai-layer/multi_ai_consensus.js";
import * as Resource  from "../ai-layer/resource_manager.js";
import * as KB        from "../ai-layer/knowledge_base.js";
import * as EvoTrack  from "../ai-layer/evolution_tracker.js";
import * as Failsafe  from "../ai-layer/failsafe_system.js";
import * as Goals     from "../ai-layer/goal_mission_system.js";
import * as MetaGov   from "../ai-layer/meta_governance.js";
import * as BlockObs  from "../ai-layer/blockchain_observer.js";

const router = Router();

// ── Dashboard ─────────────────────────────────────────────────
router.get("/evolution/dashboard", (_req, res) => {
  res.json(Orch.getSystemDashboard());
});

// ── Orchestrator control ──────────────────────────────────────
router.get("/evolution/status", (_req, res) => {
  res.json(Orch.getOrchestratorState());
});

router.get("/evolution/cycles", (req, res) => {
  const limit = Math.min(50, parseInt(String(req.query["limit"] ?? "20"), 10));
  res.json(Orch.getCycleHistory(limit));
});

router.post("/evolution/cycle/run", async (_req, res) => {
  const cycle = await Orch.runEvolutionCycle();
  res.json(cycle);
});

// ── System health & monitoring ────────────────────────────────
router.get("/evolution/health", (_req, res) => {
  res.json(Monitor.getSystemHealth());
});

router.get("/evolution/metrics", (req, res) => {
  const limit    = Math.min(200, parseInt(String(req.query["limit"] ?? "100"), 10));
  const category = req.query["category"] as Monitor.SystemMetric["category"] | undefined;
  res.json(Monitor.getRecentMetrics(limit, category));
});

router.get("/evolution/anomalies", (req, res) => {
  const all = req.query["all"] === "true";
  res.json(all ? Monitor.getAllAnomalies(100) : Monitor.getOpenAnomalies());
});

// ── Sandbox ───────────────────────────────────────────────────
router.get("/evolution/sandbox/history", (req, res) => {
  const limit = Math.min(50, parseInt(String(req.query["limit"] ?? "20"), 10));
  res.json(Sandbox.getSandboxHistory(limit));
});

router.post("/evolution/sandbox/submit", async (req, res) => {
  const { submittedBy, type, description, payload } = req.body as {
    submittedBy: string; type: Sandbox.SandboxChange["type"];
    description: string; payload: Record<string, unknown>;
  };
  if (!submittedBy || !type || !description) {
    res.status(400).json({ error: "Missing: submittedBy, type, description" }); return;
  }
  const change = Sandbox.submitForSandbox({ submittedBy, type, description, payload: payload ?? {} });
  const result = await Sandbox.runSandboxTest(change);
  res.json({ change, result });
});

// ── Version control ───────────────────────────────────────────
router.get("/evolution/versions", (_req, res) => {
  res.json({ current: VerCtrl.getCurrentVersion(), snapshots: VerCtrl.getAllSnapshots() });
});

router.get("/evolution/versions/history", (req, res) => {
  const limit = Math.min(100, parseInt(String(req.query["limit"] ?? "30"), 10));
  res.json(VerCtrl.getVersionHistory(limit));
});

router.post("/evolution/versions/rollback", (req, res) => {
  const { version, reason, requestedBy } = req.body as { version: number; reason: string; requestedBy: string };
  if (!version || !reason) { res.status(400).json({ error: "Missing: version, reason" }); return; }
  const snap = VerCtrl.rollback(version, reason);
  if (!snap) { res.status(404).json({ error: `Version ${version} not found` }); return; }
  res.json({ success: true, restoredSnapshot: snap });
});

// ── Governance ────────────────────────────────────────────────
router.get("/evolution/governance/agents", (_req, res) => {
  res.json({ tiers: Gov.getTierStats(), agents: Gov.getAllRecords() });
});

router.get("/evolution/governance/agent/:id", (req, res) => {
  const rec = Gov.getRecord(req.params["id"]!);
  if (!rec) { res.status(404).json({ error: "Agent not found" }); return; }
  res.json(rec);
});

// ── Consensus ─────────────────────────────────────────────────
router.get("/evolution/consensus/proposals", (req, res) => {
  const open = req.query["status"] === "open";
  res.json(open ? Consensus.getOpenProposals() : Consensus.getAllProposals(50));
});

router.post("/evolution/consensus/propose", (req, res) => {
  const { proposedBy, type, title, description, payload, threshold } = req.body as {
    proposedBy: string; type: Consensus.ConsensusProposal["type"];
    title: string; description: string; payload: Record<string, unknown>; threshold?: number;
  };
  if (!proposedBy || !type || !title) {
    res.status(400).json({ error: "Missing: proposedBy, type, title" }); return;
  }
  const proposal = Consensus.createProposal(proposedBy, type, title,
    description ?? "", payload ?? {}, "ADVANCED", threshold ?? 0.6);
  res.status(201).json(proposal);
});

router.post("/evolution/consensus/vote", (req, res) => {
  const { proposalId, voterId, vote, reason } = req.body as {
    proposalId: string; voterId: string; vote: Consensus.ConsensusVote["vote"]; reason?: string;
  };
  if (!proposalId || !voterId || !vote) {
    res.status(400).json({ error: "Missing: proposalId, voterId, vote" }); return;
  }
  const result = Consensus.castVote(proposalId, voterId, vote, reason);
  res.json(result);
});

// ── Knowledge base ────────────────────────────────────────────
router.get("/evolution/knowledge", (req, res) => {
  const { topic, category, minConfidence } = req.query as {
    topic?: string; category?: KB.KnowledgeEntry["category"]; minConfidence?: string;
  };
  res.json(KB.query(topic, category, parseFloat(minConfidence ?? "0.5")));
});

router.post("/evolution/knowledge", (req, res) => {
  const { createdBy, topic, category, summary, payload, confidence } = req.body as {
    createdBy: string; topic: string; category: KB.KnowledgeEntry["category"];
    summary: string; payload?: Record<string, unknown>; confidence?: number;
  };
  if (!createdBy || !topic || !summary) {
    res.status(400).json({ error: "Missing: createdBy, topic, summary" }); return;
  }
  const entry = KB.store(createdBy, topic, category ?? "discovery", summary, payload ?? {}, confidence ?? 0.8);
  res.status(201).json(entry);
});

// ── Evolution tracking ────────────────────────────────────────
router.get("/evolution/tracking/summary", (_req, res) => {
  res.json(EvoTrack.getSummary());
});

router.get("/evolution/tracking/history", (req, res) => {
  const limit = Math.min(200, parseInt(String(req.query["limit"] ?? "100"), 10));
  res.json(EvoTrack.getHistory(limit));
});

// ── Goals & Mission ───────────────────────────────────────────
router.get("/evolution/goals", (_req, res) => {
  res.json({ mission: Goals.getMission(), progress: Goals.getGoalProgress() });
});

router.get("/evolution/goals/active", (_req, res) => {
  res.json(Goals.getActiveGoals());
});

// ── Failsafe ──────────────────────────────────────────────────
router.get("/evolution/failsafe", (_req, res) => {
  res.json(Failsafe.getFailsafeState());
});

router.post("/evolution/failsafe/activate", (req, res) => {
  const { level, reason, by, autoResetMs } = req.body as {
    level: Failsafe.FailsafeLevel; reason: string; by: string; autoResetMs?: number;
  };
  if (!level || !reason || !by) { res.status(400).json({ error: "Missing: level, reason, by" }); return; }
  Failsafe.activateFailsafe(level, reason, by, autoResetMs);
  res.json({ success: true, state: Failsafe.getFailsafeState() });
});

router.post("/evolution/failsafe/deactivate", (req, res) => {
  const { by, reason } = req.body as { by: string; reason: string };
  Failsafe.deactivateFailsafe(by ?? "api", reason ?? "Manual deactivation");
  res.json({ success: true, state: Failsafe.getFailsafeState() });
});

// ── Meta governance ───────────────────────────────────────────
router.get("/evolution/governance/rules", (_req, res) => {
  res.json(MetaGov.getAllRules());
});

router.patch("/evolution/governance/rules/:id", (req, res) => {
  const { newValue, modifiedBy, reason } = req.body as {
    newValue: unknown; modifiedBy: string; reason: string;
  };
  if (newValue === undefined || !modifiedBy) {
    res.status(400).json({ error: "Missing: newValue, modifiedBy" }); return;
  }
  const result = MetaGov.modifyRule(req.params["id"]!, newValue, modifiedBy, reason ?? "");
  if (!result.success) { res.status(400).json(result); return; }
  res.json(result);
});

// ── Blockchain observer ───────────────────────────────────────
router.get("/evolution/blockchain/status", async (_req, res) => {
  const status = await BlockchainObs.refreshBlockchainStatus();
  res.json({ status, aiRecommendation: BlockchainObs.recommendAIBehavior() });
});

// ── Resource manager ──────────────────────────────────────────
router.get("/evolution/resources", (_req, res) => {
  res.json(Resource.getSystemResourceSummary());
});

router.get("/evolution/resources/agent/:id", (req, res) => {
  res.json(Resource.getBudgetStatus(req.params["id"]!));
});

export default router;
