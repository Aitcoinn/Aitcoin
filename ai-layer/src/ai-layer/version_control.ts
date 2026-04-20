// ============================================================
// VERSION_CONTROL.TS — Versioning & Rollback System (#11)
// Snapshot setiap perubahan sistem, rollback otomatis jika error
// ============================================================

import { emit } from "./system_monitor.js";

export interface SystemSnapshot {
  version:     number;
  snapshotId:  string;
  createdAt:   number;
  createdBy:   string;
  description: string;
  stateBlob:   Record<string, unknown>;  // frozen state
  checksum:    string;
  stable:      boolean;
}

export interface VersionEvent {
  at:          number;
  type:        "snapshot" | "rollback" | "apply" | "corrupt";
  version:     number;
  snapshotId:  string;
  reason:      string;
}

// ── In-memory store ───────────────────────────────────────────
const snapshots: SystemSnapshot[] = [];
const events:    VersionEvent[]    = [];
let   currentVersion = 0;
const MAX_SNAPSHOTS  = 50;

function simpleChecksum(obj: Record<string, unknown>): string {
  const str = JSON.stringify(obj);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

// ── Create snapshot ───────────────────────────────────────────
export function createSnapshot(
  state:       Record<string, unknown>,
  createdBy:   string,
  description: string,
): SystemSnapshot {
  currentVersion++;
  const snap: SystemSnapshot = {
    version:     currentVersion,
    snapshotId:  `snap_v${currentVersion}_${Date.now().toString(36)}`,
    createdAt:   Date.now(),
    createdBy,
    description,
    stateBlob:   structuredClone(state),
    checksum:    simpleChecksum(state),
    stable:      false,
  };
  snapshots.push(snap);
  if (snapshots.length > MAX_SNAPSHOTS) snapshots.shift();

  events.push({ at: Date.now(), type: "snapshot", version: snap.version,
    snapshotId: snap.snapshotId, reason: description });

  emit("health", "info", "version_control",
    `Snapshot created: v${snap.version} (${snap.snapshotId})`);
  return snap;
}

// ── Mark snapshot as stable ───────────────────────────────────
export function markStable(snapshotId: string): boolean {
  const s = snapshots.find(x => x.snapshotId === snapshotId);
  if (!s) return false;
  s.stable = true;
  emit("health", "info", "version_control", `Snapshot marked stable: ${snapshotId}`);
  return true;
}

// ── Rollback to a specific version ───────────────────────────
export function rollback(version: number, reason: string): SystemSnapshot | null {
  const snap = snapshots.find(s => s.version === version);
  if (!snap) {
    emit("health", "warn", "version_control", `Rollback failed: version ${version} not found`);
    return null;
  }
  currentVersion = version;
  events.push({ at: Date.now(), type: "rollback", version,
    snapshotId: snap.snapshotId, reason });
  emit("health", "warn", "version_control",
    `Rolled back to v${version}: ${reason}`, { snapshotId: snap.snapshotId });
  return snap;
}

// ── Auto-rollback to last stable ─────────────────────────────
export function autoRollbackToLastStable(reason: string): SystemSnapshot | null {
  const stable = [...snapshots].reverse().find(s => s.stable);
  if (!stable) {
    emit("health", "critical", "version_control", "No stable snapshot found for rollback!");
    return null;
  }
  return rollback(stable.version, `Auto-rollback: ${reason}`);
}

// ── Query ─────────────────────────────────────────────────────
export function getLatestSnapshot(): SystemSnapshot | null {
  return snapshots[snapshots.length - 1] ?? null;
}
export function getAllSnapshots(): SystemSnapshot[] { return [...snapshots]; }
export function getVersionHistory(limit = 30): VersionEvent[] { return events.slice(-limit); }
export function getCurrentVersion(): number { return currentVersion; }
