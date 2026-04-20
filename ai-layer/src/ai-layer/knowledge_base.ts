// ============================================================
// KNOWLEDGE_BASE.TS — Knowledge Persistence & Sharing (#19)
// AI menyimpan dan berbagi pengetahuan hasil pembelajaran
// Hindari pengulangan kesalahan yang sama
// ============================================================

import { emit } from "./system_monitor.js";

export interface KnowledgeEntry {
  id:           string;
  createdBy:    string;
  createdAt:    number;
  topic:        string;
  category:     "fix" | "optimization" | "pattern" | "warning" | "discovery";
  summary:      string;
  payload:      Record<string, unknown>;
  confidence:   number;    // 0-1
  usageCount:   number;
  lastUsedAt:   number;
  sharedWith:   string[];  // agent IDs that received this knowledge
  verified:     boolean;
}

export interface LearningEvent {
  at:        number;
  agentId:   string;
  learnedId: string;   // knowledge entry id
  outcome:   "success" | "failure" | "partial";
  feedback?: string;
}

// ── In-memory knowledge graph ─────────────────────────────────
const kb = new Map<string, KnowledgeEntry>();
const events: LearningEvent[] = [];
const MAX_ENTRIES = 500;

export function store(
  createdBy:  string,
  topic:      string,
  category:   KnowledgeEntry["category"],
  summary:    string,
  payload:    Record<string, unknown>,
  confidence  = 0.8,
): KnowledgeEntry {
  const entry: KnowledgeEntry = {
    id:        `kb_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    createdBy, createdAt: Date.now(), topic, category, summary, payload,
    confidence, usageCount: 0, lastUsedAt: Date.now(), sharedWith: [], verified: false,
  };
  kb.set(entry.id, entry);
  // Evict oldest low-confidence entries if over limit
  if (kb.size > MAX_ENTRIES) {
    const sorted = [...kb.entries()].sort((a, b) => a[1].confidence - b[1].confidence);
    kb.delete(sorted[0][0]);
  }
  emit("health", "info", "knowledge_base",
    `Knowledge stored: "${summary.slice(0, 60)}" by ${createdBy}`, { id: entry.id, category });
  return entry;
}

export function query(
  topic?:    string,
  category?: KnowledgeEntry["category"],
  minConfidence = 0.5,
  limit = 20,
): KnowledgeEntry[] {
  return [...kb.values()]
    .filter(e =>
      e.confidence >= minConfidence &&
      (!topic    || e.topic.toLowerCase().includes(topic.toLowerCase())) &&
      (!category || e.category === category)
    )
    .sort((a, b) => b.usageCount - a.usageCount || b.confidence - a.confidence)
    .slice(0, limit);
}

export function use(id: string, agentId: string, outcome: LearningEvent["outcome"], feedback?: string): void {
  const e = kb.get(id);
  if (!e) return;
  e.usageCount++;
  e.lastUsedAt = Date.now();
  // Adjust confidence based on outcome
  if (outcome === "success") e.confidence = Math.min(1, e.confidence + 0.02);
  if (outcome === "failure") e.confidence = Math.max(0, e.confidence - 0.05);
  events.push({ at: Date.now(), agentId, learnedId: id, outcome, feedback });
}

export function share(id: string, toAgentIds: string[]): boolean {
  const e = kb.get(id);
  if (!e) return false;
  for (const aid of toAgentIds) {
    if (!e.sharedWith.includes(aid)) e.sharedWith.push(aid);
  }
  emit("health", "info", "knowledge_base",
    `Knowledge shared: ${id} → ${toAgentIds.length} agents`);
  return true;
}

export function verify(id: string): boolean {
  const e = kb.get(id);
  if (!e) return false;
  e.verified = true;
  e.confidence = Math.min(1, e.confidence + 0.1);
  return true;
}

export function getErrorPatterns(): KnowledgeEntry[] {
  return query(undefined, "fix", 0.5, 50);
}

export function getStats(): {
  total: number; verified: number; topTopics: string[]
} {
  const topics = [...kb.values()].map(e => e.topic);
  const freq: Record<string, number> = {};
  for (const t of topics) freq[t] = (freq[t] ?? 0) + 1;
  return {
    total:     kb.size,
    verified:  [...kb.values()].filter(e => e.verified).length,
    topTopics: Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5).map(x=>x[0]),
  };
}
