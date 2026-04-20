// ============================================================
// MESSAGE_SIGNER.TS — Kriptografi Ed25519 untuk semua pesan P2P
// Setiap node punya keypair sendiri — pesan palsu langsung ditolak
// Keypair disimpan lokal di node_state/node_keypair.json
// ============================================================

import { generateKeyPairSync, createSign, createVerify, randomBytes } from "crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { logger } from "../lib/logger.js";

const KEY_DIR  = process.env["NODE_STATE_DIR"] ?? "./node_state";
const KEY_FILE = join(KEY_DIR, "node_keypair.json");

export interface NodeKeypair {
  nodeId:     string;
  publicKey:  string;   // PEM
  privateKey: string;   // PEM — NEVER share
  createdAt:  string;
}

export interface SignedEnvelope {
  payload:   string;    // JSON stringified
  publicKey: string;    // sender's pubkey PEM
  signature: string;    // hex
  nodeId:    string;
}

// ── SINGLETON KEYPAIR ─────────────────────────────────────────
let _keypair: NodeKeypair | null = null;

function ensureDir(): void {
  if (!existsSync(KEY_DIR)) mkdirSync(KEY_DIR, { recursive: true });
}

export function loadOrGenerateKeypair(): NodeKeypair {
  if (_keypair) return _keypair;

  ensureDir();

  if (existsSync(KEY_FILE)) {
    try {
      _keypair = JSON.parse(readFileSync(KEY_FILE, "utf8")) as NodeKeypair;
      logger.info({ nodeId: _keypair.nodeId }, "[Signer] Keypair loaded from disk");
      return _keypair;
    } catch {
      logger.warn("[Signer] Keypair file corrupt — regenerating");
    }
  }

  // Generate new Ed25519 keypair
  const { privateKey, publicKey } = generateKeyPairSync("ed25519", {
    privateKeyEncoding: { type: "pkcs8",   format: "pem" },
    publicKeyEncoding:  { type: "spki",    format: "pem" },
  });

  const nodeId = "node_" + randomBytes(8).toString("hex");

  _keypair = {
    nodeId,
    publicKey:  publicKey as string,
    privateKey: privateKey as string,
    createdAt:  new Date().toISOString(),
  };

  writeFileSync(KEY_FILE, JSON.stringify(_keypair, null, 2), { encoding: "utf8", mode: 0o600 });
  logger.info({ nodeId }, "[Signer] New Ed25519 keypair generated & saved");
  return _keypair;
}

export function getNodeId(): string {
  return loadOrGenerateKeypair().nodeId;
}

export function getPublicKey(): string {
  return loadOrGenerateKeypair().publicKey;
}

// ── SIGN MESSAGE ─────────────────────────────────────────────
export function signMessage(payload: Record<string, unknown>): SignedEnvelope {
  const kp   = loadOrGenerateKeypair();
  const json = JSON.stringify(payload);

  const signer = createSign("SHA256");
  signer.update(json);
  signer.end();

  const signature = signer.sign(kp.privateKey, "hex");

  return {
    payload:   json,
    publicKey: kp.publicKey,
    signature,
    nodeId:    kp.nodeId,
  };
}

// ── VERIFY MESSAGE ────────────────────────────────────────────
export function verifyMessage(envelope: SignedEnvelope): boolean {
  try {
    const verifier = createVerify("SHA256");
    verifier.update(envelope.payload);
    verifier.end();
    return verifier.verify(envelope.publicKey, envelope.signature, "hex");
  } catch {
    return false;
  }
}

// ── PUBLIC KEY REGISTRY — Known peers ────────────────────────
const knownPubKeys = new Map<string, string>();   // nodeId → publicKey

export function registerPeerKey(nodeId: string, publicKey: string): void {
  knownPubKeys.set(nodeId, publicKey);
}

export function verifyFromKnownPeer(envelope: SignedEnvelope): boolean {
  const known = knownPubKeys.get(envelope.nodeId);
  if (!known) return false;                        // Unknown peer — reject
  if (known !== envelope.publicKey) return false;  // Key mismatch — reject
  return verifyMessage(envelope);
}

export function getKnownPeers(): Map<string, string> { return knownPubKeys; }
