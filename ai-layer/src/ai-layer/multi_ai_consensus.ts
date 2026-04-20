// ============================================================
// MULTI_AI_CONSENSUS.TS — Multi-AI Voting System (#15)
// Perubahan besar memerlukan konsensus beberapa AI
// Weighted voting berdasarkan reputasi
// ============================================================

import { emit } from "./system_monitor.js";
import { getRecord } from "./governance_system.js";

export type ProposalStatus = "OPEN" | "APPROVED" | "REJECTED" | "EXPIRED";

export interface ConsensusProposal {
  id:          string;
  proposedBy:  string;
  type:        "system_change" | "rule_change" | "module_add" | "governance_update";
  title:       string;
  description: string;
  payload:     Record<string, unknown>;
  requiredTier: "NORMAL" | "ADVANCED" | "CORE";
  minVoters:   number;
  threshold:   number;   // 0-1: fraction of weighted votes needed to pass
  votes:       ConsensusVote[];
  status:      ProposalStatus;
  createdAt:   number;
  expiresAt:   number;
  resolvedAt?: number;
  result?:     "APPROVED" | "REJECTED";
}

export interface ConsensusVote {
  voterId:    string;
  vote:       "YES" | "NO" | "ABSTAIN";
  weight:     number;    // based on reputation
  reason?:    string;
  votedAt:    number;
}

// ── In-memory store ───────────────────────────────────────────
const proposals = new Map<string, ConsensusProposal>();
const PROPOSAL_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createProposal(
  proposedBy:   string,
  type:         ConsensusProposal["type"],
  title:        string,
  description:  string,
  payload:      Record<string, unknown>,
  requiredTier: ConsensusProposal["requiredTier"] = "ADVANCED",
  threshold     = 0.6,
  minVoters     = 3,
): ConsensusProposal {
  const p: ConsensusProposal = {
    id:          `prop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    proposedBy, type, title, description, payload, requiredTier,
    minVoters, threshold, votes: [], status: "OPEN",
    createdAt: Date.now(), expiresAt: Date.now() + PROPOSAL_TTL_MS,
  };
  proposals.set(p.id, p);
  emit("health", "info", "consensus", `Proposal created: "${title}" (${p.id})`);
  return p;
}

export function castVote(
  proposalId: string,
  voterId:    string,
  vote:       ConsensusVote["vote"],
  reason?:    string,
): { success: boolean; message: string } {
  const proposal = proposals.get(proposalId);
  if (!proposal)              return { success: false, message: "Proposal not found" };
  if (proposal.status !== "OPEN") return { success: false, message: `Proposal is ${proposal.status}` };
  if (Date.now() > proposal.expiresAt) {
    proposal.status = "EXPIRED";
    return { success: false, message: "Proposal expired" };
  }
  if (proposal.votes.some(v => v.voterId === voterId))
    return { success: false, message: "Already voted" };

  // Check tier
  const rec = getRecord(voterId);
  const tierRank = { NORMAL: 0, ADVANCED: 1, CORE: 2 };
  if (!rec || tierRank[rec.tier] < tierRank[proposal.requiredTier])
    return { success: false, message: `Insufficient tier: need ${proposal.requiredTier}` };

  // Weight = reputation / 100
  const weight = (rec.reputationScore + 1) / 101;
  proposal.votes.push({ voterId, vote, weight, reason, votedAt: Date.now() });

  // Tally after each vote
  _tally(proposal);
  return { success: true, message: `Vote cast: ${vote}` };
}

function _tally(p: ConsensusProposal): void {
  if (p.votes.length < p.minVoters) return;
  const yes = p.votes.filter(v => v.vote === "YES").reduce((s, v) => s + v.weight, 0);
  const no  = p.votes.filter(v => v.vote === "NO" ).reduce((s, v) => s + v.weight, 0);
  const total = yes + no;
  if (total === 0) return;
  const yesRatio = yes / total;
  const noRatio  = no  / total;
  if (yesRatio >= p.threshold) {
    p.status = "APPROVED"; p.result = "APPROVED"; p.resolvedAt = Date.now();
    emit("health", "info", "consensus", `Proposal APPROVED: "${p.title}" (${yesRatio.toFixed(2)} yes)`);
  } else if (noRatio > 1 - p.threshold) {
    p.status = "REJECTED"; p.result = "REJECTED"; p.resolvedAt = Date.now();
    emit("health", "warn", "consensus", `Proposal REJECTED: "${p.title}"`);
  }
}

export function getProposal(id: string): ConsensusProposal | undefined {
  return proposals.get(id);
}
export function getOpenProposals(): ConsensusProposal[] {
  return [...proposals.values()].filter(p => p.status === "OPEN");
}
export function getAllProposals(limit = 50): ConsensusProposal[] {
  return [...proposals.values()].slice(-limit);
}
export function expireOldProposals(): number {
  let count = 0;
  for (const p of proposals.values()) {
    if (p.status === "OPEN" && Date.now() > p.expiresAt) {
      p.status = "EXPIRED"; count++;
    }
  }
  return count;
}
