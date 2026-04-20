// ============================================================
// GOAL_MISSION_SYSTEM.TS — Global Objectives & Direction (#18)
// AI tidak hanya bereaksi — punya arah jangka panjang
// Terintegrasi dengan desire_engine, ambition_engine, value_system
// ============================================================

import { emit } from "./system_monitor.js";

export type GoalPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type GoalStatus   = "PENDING" | "ACTIVE" | "ACHIEVED" | "FAILED" | "DEFERRED";

export interface SystemGoal {
  id:           string;
  title:        string;
  description:  string;
  priority:     GoalPriority;
  status:       GoalStatus;
  progress:     number;       // 0-1
  metric:       string;       // how to measure
  targetValue:  number;
  currentValue: number;
  createdAt:    number;
  targetDate?:  number;
  achievedAt?:  number;
  subGoals:     string[];     // IDs of sub-goals
}

export interface GlobalMission {
  name:        string;
  description: string;
  values:      string[];   // core values to uphold
  goals:       SystemGoal[];
  evolutionDirection: "stability" | "growth" | "intelligence" | "resilience";
}

// ── Global mission definition ─────────────────────────────────
const mission: GlobalMission = {
  name: "AITCOIN Living Digital Civilization",
  description: "Build a self-sustaining, self-improving AI civilization integrated with blockchain",
  values: ["stability", "transparency", "intelligence", "cooperation", "evolution"],
  evolutionDirection: "intelligence",
  goals: [],
};

// ── Predefined system goals ───────────────────────────────────
const DEFAULT_GOALS: Omit<SystemGoal, "id" | "createdAt">[] = [
  {
    title: "Achieve System Stability",
    description: "Maintain error rate below 0.1 per second for 24 hours",
    priority: "CRITICAL", status: "ACTIVE", progress: 0,
    metric: "errorRate", targetValue: 0.1, currentValue: 0, subGoals: [],
  },
  {
    title: "Grow AI Population",
    description: "Maintain at least 80% of 100 agents in ACTIVE state",
    priority: "HIGH", status: "ACTIVE", progress: 0,
    metric: "activeAgentRatio", targetValue: 0.8, currentValue: 0, subGoals: [],
  },
  {
    title: "Knowledge Accumulation",
    description: "Store 500 verified knowledge entries in knowledge base",
    priority: "HIGH", status: "ACTIVE", progress: 0,
    metric: "verifiedKnowledge", targetValue: 500, currentValue: 0, subGoals: [],
  },
  {
    title: "Self-Improvement Cycles",
    description: "Complete 100 successful self-improvement cycles",
    priority: "MEDIUM", status: "ACTIVE", progress: 0,
    metric: "improvementCycles", targetValue: 100, currentValue: 0, subGoals: [],
  },
  {
    title: "Quantum Security Integration",
    description: "All AI signatures use Dilithium3 post-quantum cryptography",
    priority: "CRITICAL", status: "PENDING", progress: 0,
    metric: "pqSignatureRatio", targetValue: 1.0, currentValue: 0, subGoals: [],
  },
  {
    title: "Consensus Maturity",
    description: "Resolve 50 system change proposals via multi-AI consensus",
    priority: "MEDIUM", status: "ACTIVE", progress: 0,
    metric: "consensusResolved", targetValue: 50, currentValue: 0, subGoals: [],
  },
];

function initGoals(): void {
  for (const g of DEFAULT_GOALS) {
    const goal: SystemGoal = {
      ...g,
      id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      createdAt: Date.now(),
    };
    mission.goals.push(goal);
  }
}
initGoals();

// ── Update goal progress ──────────────────────────────────────
export function updateGoalProgress(metric: string, currentValue: number): void {
  for (const goal of mission.goals) {
    if (goal.metric !== metric || goal.status !== "ACTIVE") continue;
    goal.currentValue = currentValue;
    goal.progress     = Math.min(1, currentValue / goal.targetValue);
    if (goal.progress >= 1.0 && goal.status === "ACTIVE") {
      goal.status     = "ACHIEVED";
      goal.achievedAt = Date.now();
      goal.progress   = 1.0;
      emit("health", "info", "goal_mission",
        `Goal ACHIEVED: "${goal.title}"`, { metric, value: currentValue });
    }
  }
}

export function addGoal(g: Omit<SystemGoal, "id" | "createdAt">): SystemGoal {
  const goal: SystemGoal = { ...g, id: `goal_${Date.now()}`, createdAt: Date.now() };
  mission.goals.push(goal);
  return goal;
}

export function getMission(): GlobalMission { return { ...mission }; }
export function getActiveGoals(): SystemGoal[] {
  return mission.goals.filter(g => g.status === "ACTIVE");
}
export function getAchievedGoals(): SystemGoal[] {
  return mission.goals.filter(g => g.status === "ACHIEVED");
}
export function getGoalProgress(): { total: number; achieved: number; avgProgress: number } {
  const goals = mission.goals;
  return {
    total:       goals.length,
    achieved:    goals.filter(g => g.status === "ACHIEVED").length,
    avgProgress: goals.reduce((s, g) => s + g.progress, 0) / (goals.length || 1),
  };
}
export function getEvolutionDirection(): GlobalMission["evolutionDirection"] {
  return mission.evolutionDirection;
}
export function setEvolutionDirection(dir: GlobalMission["evolutionDirection"]): void {
  mission.evolutionDirection = dir;
  emit("health", "info", "goal_mission", `Evolution direction set to: ${dir}`);
}
