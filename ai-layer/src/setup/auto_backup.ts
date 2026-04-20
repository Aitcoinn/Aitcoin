// ============================================================
// AUTO_BACKUP.TS — Auto Backup wallet_state & node_state
// Backup otomatis setiap 24 jam ke folder backup/
// Tidak butuh dependency tambahan — pakai fs native
// ============================================================

import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";
import { logger } from "../lib/logger.js";

const WALLET_STATE_DIR = process.env["WALLET_STATE_DIR"] ?? "./wallet_state";
const NODE_STATE_DIR   = process.env["NODE_STATE_DIR"]   ?? "./node_state";
const BACKUP_DIR       = process.env["BACKUP_DIR"]       ?? "./backups";
const BACKUP_INTERVAL  = 24 * 60 * 60 * 1000;   // 24 jam
const MAX_BACKUPS      = 30;                      // simpan 30 hari terakhir

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function backupDir(srcDir: string, label: string): number {
  if (!existsSync(srcDir)) return 0;
  const destDir = join(BACKUP_DIR, label, timestamp());
  ensureDir(destDir);

  let count = 0;
  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith(".json")) continue;
    try {
      copyFileSync(join(srcDir, file), join(destDir, file));
      count++;
    } catch (err) {
      logger.warn({ err, file }, "[Backup] Failed to backup file");
    }
  }
  return count;
}

function pruneOldBackups(label: string): void {
  const dir = join(BACKUP_DIR, label);
  if (!existsSync(dir)) return;

  const entries = readdirSync(dir)
    .map(name => ({ name, mtime: statSync(join(dir, name)).mtime.getTime() }))
    .sort((a, b) => b.mtime - a.mtime);    // newest first

  // Remove oldest beyond MAX_BACKUPS
  for (const entry of entries.slice(MAX_BACKUPS)) {
    try {
      const fullPath = join(dir, entry.name);
      for (const file of readdirSync(fullPath)) unlinkSync(join(fullPath, file));
      require("fs").rmdirSync(fullPath);
    } catch { /* ignore */ }
  }
}

export function runBackup(): { walletFiles: number; nodeFiles: number } {
  ensureDir(BACKUP_DIR);

  const walletFiles = backupDir(WALLET_STATE_DIR, "wallet");
  const nodeFiles   = backupDir(NODE_STATE_DIR,   "node");

  pruneOldBackups("wallet");
  pruneOldBackups("node");

  logger.info(
    { walletFiles, nodeFiles, dest: BACKUP_DIR },
    `[Backup] Done — wallet:${walletFiles} node:${nodeFiles} files backed up`,
  );
  return { walletFiles, nodeFiles };
}

let _backupTimer: ReturnType<typeof setInterval> | null = null;

export function startAutoBackup(): void {
  if (_backupTimer) return;

  // Run immediately on startup, then every 24h
  runBackup();
  _backupTimer = setInterval(runBackup, BACKUP_INTERVAL);
  logger.info({ intervalHours: 24, maxBackups: MAX_BACKUPS }, "[Backup] Auto-backup started");
}

export function stopAutoBackup(): void {
  if (_backupTimer) { clearInterval(_backupTimer); _backupTimer = null; }
}
