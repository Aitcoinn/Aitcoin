// ============================================================
// P2P/TYPES.TS — Shared type definitions for P2P Layer
// v3: Added SignedEnvelope, PEX types, new message types
// ============================================================

export type NodeType = "BASIC_NODE" | "AI_NODE" | "VALIDATOR_NODE";

export interface PeerInfo {
  nodeId:    string;
  address:   string;
  port:      number;
  nodeType:  NodeType;
  publicKey?: string;    // Ed25519 pubkey — untuk verifikasi pesan
  connectedAt: number;
  lastSeen:  number;
  reputation?: number;
}

export interface P2PMessage {
  type:      P2PMessageType;
  from:      string;
  to?:       string;
  payload:   Record<string, unknown>;
  timestamp: number;
  // Tanda tangan kriptografi (opsional — wajib untuk pesan sensitif)
  signature?: string;
  publicKey?: string;
}

export type P2PMessageType =
  | "HELLO"
  | "HELLO_ACK"
  | "PEER_LIST"
  | "PEER_DISCOVERY"         // PEX: GETADDR / ADDR
  | "TASK_BROADCAST"
  | "TASK_ACCEPT"
  | "TASK_RESULT"
  | "TASK_VALIDATE"
  | "VALIDATION_VOTE"
  | "CONSENSUS_RESULT"
  | "HEARTBEAT"
  | "STATE_SYNC"             // pool state, validator apply, dll
  | "REPUTATION_UPDATE"
  | "CONTRIBUTION_UPDATE"
  | "BLOCKCHAIN_RESULT"
  | "GOODBYE";

export interface AITask {
  taskId:    string;
  type:      "TX_VALIDATE" | "AI_INFERENCE" | "CONSENSUS" | "MEMPOOL_SCAN" | "GENERATE" | "PROCESS";
  payload:   Record<string, unknown>;
  priority:  number;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  status:    "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CONSENSUS_OK" | "CONSENSUS_FAIL";
  result?:   Record<string, unknown>;
  assignedTo?: string;
  votes?:    ValidationVote[];
}

export interface ValidationVote {
  validatorId: string;
  approved:    boolean;
  confidence:  number;
  weight:      number;
  timestamp:   number;
}

export interface P2PNetworkState {
  nodeId:    string;
  nodeType:  NodeType;
  p2pPort:   number;
  peers:     Map<string, PeerInfo>;
  isRunning: boolean;
}

export interface NodeLocalState {
  nodeId:               string;
  ai_memory:            Record<string, unknown>;
  ai_state:             Record<string, unknown>;
  contribution_history: ContributionRecord[];
  reputation:           number;
  lastSyncAt:           number;
}

export interface ContributionRecord {
  timestamp: number;
  type:      "task_completed" | "task_validated" | "consensus_participated" | "peer_helped";
  taskId?:   string;
  score:     number;
}
