// ============================================================
// PERMISSIONLESS_VALIDATOR.TS — Join sebagai Validator Tanpa Izin
// Siapapun bisa jadi validator jika memenuhi syarat reputasi
// Tidak ada admin — sistem memutuskan berdasarkan metrik objektif
// ============================================================

import { broadcast, receiveMessage, NODE_ID, NODE_TYPE } from "./p2p_network.js";
import { nodeRegistry } from "./node_registry.js";
import { getPublicKey, registerPeerKey, signMessage, verifyFromKnownPeer } from "./message_signer.js";
import { logger } from "../lib/logger.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── SYARAT MENJADI VALIDATOR ─────────────────────────────────
const MIN_REPUTATION          = 60;    // minimum reputasi (0-100)
const MIN_UPTIME_MS           = 60 * 60 * 1000;   // online minimal 1 jam
const MIN_TASKS_COMPLETED     = 5;     // selesaikan minimal 5 task
const VALIDATOR_REVIEW_MS     = 5 * 60 * 1000;    // evaluasi setiap 5 menit

const VALIDATOR_FILE = join(process.env["NODE_STATE_DIR"] ?? "./node_state", "validators.json");

// ── TIPE ─────────────────────────────────────────────────────
export interface ValidatorRecord {
  nodeId:       string;
  publicKey:    string;
  reputation:   number;
  tasksComplete: number;
  joinedAt:     number;
  lastSeenAt:   number;
  status:       "active" | "probation" | "ejected";
}

const validatorSet = new Map<string, ValidatorRecord>();
let startupTime    = Date.now();

// ── LOAD / SAVE ───────────────────────────────────────────────
function ensureDir(): void {
  const dir = process.env["NODE_STATE_DIR"] ?? "./node_state";
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function loadValidators(): void {
  try {
    if (existsSync(VALIDATOR_FILE)) {
      const data = JSON.parse(readFileSync(VALIDATOR_FILE, "utf8")) as ValidatorRecord[];
      for (const v of data) validatorSet.set(v.nodeId, v);
      logger.info({ count: validatorSet.size }, "[Validator] Known validators loaded");
    }
  } catch { /* start fresh */ }
}

function saveValidators(): void {
  ensureDir();
  writeFileSync(VALIDATOR_FILE, JSON.stringify(Array.from(validatorSet.values()), null, 2), "utf8");
}

// ── CEK ELIGIBILITY ───────────────────────────────────────────
function isEligible(nodeId: string): { eligible: boolean; reason: string } {
  const rep      = nodeRegistry.getReputation(nodeId);
  const uptime   = Date.now() - startupTime;

  if (rep < MIN_REPUTATION)
    return { eligible: false, reason: `Reputasi ${rep} < ${MIN_REPUTATION}` };
  if (uptime < MIN_UPTIME_MS)
    return { eligible: false, reason: `Uptime ${Math.round(uptime/60000)}m < 60m` };

  return { eligible: true, reason: "Memenuhi syarat" };
}

// ── APPLY JADI VALIDATOR ─────────────────────────────────────
// Node yang ingin jadi validator broadcast APPLICATION
export function applyAsValidator(): void {
  const { eligible, reason } = isEligible(NODE_ID);
  if (!eligible) {
    logger.info({ reason }, "[Validator] Not eligible to apply yet");
    return;
  }

  const envelope = signMessage({
    action:     "VALIDATOR_APPLICATION",
    nodeId:     NODE_ID,
    publicKey:  getPublicKey(),
    reputation: nodeRegistry.getReputation(NODE_ID),
    applyAt:    Date.now(),
  });

  broadcast({
    type:      "STATE_SYNC",
    from:      NODE_ID,
    payload:   { subtype: "VALIDATOR_APPLY", envelope },
    timestamp: Date.now(),
  });

  logger.info("[Validator] Application broadcast to network");
}

// ── EJECT VALIDATOR yang tidak aktif ─────────────────────────
function pruneInactiveValidators(): void {
  const now = Date.now();
  for (const [id, v] of validatorSet) {
    const inactive = now - v.lastSeenAt;
    if (inactive > 10 * 60 * 1000) {   // 10 menit tidak aktif
      v.status = "ejected";
      validatorSet.delete(id);
      logger.info({ nodeId: id, inactiveMs: inactive }, "[Validator] Ejected inactive validator");
    }
  }
  saveValidators();
}

// ── INIT ──────────────────────────────────────────────────────
export function initPermissionlessValidator(): void {
  startupTime = Date.now();
  loadValidators();

  // Listen untuk aplikasi validator dari peer lain
  receiveMessage((msg) => {
    if (msg.type !== "STATE_SYNC") return;
    const p = msg.payload as Record<string, unknown>;
    if (p["subtype"] !== "VALIDATOR_APPLY") return;

    const env = p["envelope"] as Parameters<typeof verifyFromKnownPeer>[0];
    if (!env) return;

    // Daftarkan public key peer jika belum ada
    registerPeerKey(env.nodeId, env.publicKey);

    // Verifikasi tanda tangan
    if (!verifyFromKnownPeer(env)) {
      logger.warn({ from: msg.from }, "[Validator] Rejected: invalid signature");
      return;
    }

    const data = JSON.parse(env.payload) as Record<string, unknown>;
    const rep  = nodeRegistry.getReputation(env.nodeId);

    if (rep >= MIN_REPUTATION) {
      const record: ValidatorRecord = {
        nodeId:        env.nodeId,
        publicKey:     env.publicKey,
        reputation:    rep,
        tasksComplete: 0,
        joinedAt:      Date.now(),
        lastSeenAt:    Date.now(),
        status:        "active",
      };
      validatorSet.set(env.nodeId, record);
      saveValidators();
      logger.info({ nodeId: env.nodeId, rep }, "[Validator] New validator accepted into set");
    } else {
      logger.info({ nodeId: env.nodeId, rep, minRequired: MIN_REPUTATION }, "[Validator] Application rejected — insufficient reputation");
    }
  });

  // Periodic: prune inactive + self-apply if eligible
  setInterval(() => {
    pruneInactiveValidators();
    if (NODE_TYPE === "VALIDATOR_NODE") applyAsValidator();
  }, VALIDATOR_REVIEW_MS);

  logger.info({
    criteria: { minReputation: MIN_REPUTATION, minUptimeMin: MIN_UPTIME_MS / 60000 },
    currentValidators: validatorSet.size,
  }, "[Validator] Permissionless validator system initialized");
}

// ── QUERIES ───────────────────────────────────────────────────
export function getActiveValidators():  ValidatorRecord[] {
  return Array.from(validatorSet.values()).filter(v => v.status === "active");
}

export function isActiveValidator(nodeId: string): boolean {
  return validatorSet.get(nodeId)?.status === "active";
}

export function getValidatorCount(): number {
  return Array.from(validatorSet.values()).filter(v => v.status === "active").length;
}
