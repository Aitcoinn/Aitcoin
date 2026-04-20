// ============================================================
// CONFIG_VALIDATOR.TS — Startup Environment Check
// Cegah crash misterius di VPS karena env var yang lupa diisi
// ============================================================

import { logger } from "../lib/logger.js";

interface EnvSpec {
  key:      string;
  required: boolean;
  default?: string;
  hint:     string;
}

const ENV_SPECS: EnvSpec[] = [
  { key: "PORT",             required: true,  hint: "Port server (e.g. 3000)" },
  { key: "DATABASE_URL",     required: false, hint: "PostgreSQL connection string — wallet & reputation DB" },
  { key: "NODE_TYPE",        required: false, default: "AI_NODE",      hint: "Node type: AI_NODE | VALIDATOR | FULL_NODE" },
  { key: "NODE_ID",          required: false, default: "auto",         hint: "Unique node ID for P2P network" },
  { key: "P2P_PORT",         required: false, default: "9080",         hint: "P2P network port" },
  { key: "ALLOWED_ORIGINS",  required: false, default: "*",            hint: "CORS origins — set to your domain in production" },
  { key: "SESSION_SECRET",   required: false, hint: "Session secret — required if using auth" },
  { key: "AITCOIN_RPC_URL",  required: false, hint: "AITCOIN C++ node RPC URL (e.g. http://127.0.0.1:8332)" },
  { key: "AITCOIN_RPC_USER", required: false, hint: "RPC username (from aitcoin.conf)" },
  { key: "AITCOIN_RPC_PASS", required: false, hint: "RPC password (from aitcoin.conf)" },
  { key: "DEV_WALLET_ADDRESS", required: false, default: "AM4YaFDSPyLDkNEhSoeQk5QBvo9FuKdFk5", hint: "Development fund wallet address" },
  { key: "WALLET_STATE_DIR",   required: false, default: "./wallet_state", hint: "Directory for local wallet state file" },
  { key: "NODE_STATE_DIR",     required: false, default: "./node_state",   hint: "Directory for P2P node state file" },
];

export interface ConfigReport {
  passed:     boolean;
  missing:    string[];
  warnings:   string[];
  summary:    string;
}

export function validateConfig(): ConfigReport {
  const missing:  string[] = [];
  const warnings: string[] = [];

  for (const spec of ENV_SPECS) {
    const val = process.env[spec.key];

    if (!val) {
      if (spec.required) {
        missing.push(`❌ REQUIRED: ${spec.key} — ${spec.hint}`);
      } else if (!spec.default) {
        warnings.push(`⚠️  OPTIONAL: ${spec.key} — ${spec.hint}`);
      }
      // Apply default if available
      if (spec.default && !val) {
        process.env[spec.key] = spec.default;
      }
    }
  }

  const passed  = missing.length === 0;
  const summary = passed
    ? `Config OK — ${ENV_SPECS.length} vars checked, ${warnings.length} optional not set`
    : `Config FAILED — ${missing.length} required vars missing`;

  if (!passed) {
    logger.error({ missing, warnings }, `[Config] ${summary}`);
    for (const m of missing) logger.error(m);
  } else {
    logger.info(`[Config] ${summary}`);
    for (const w of warnings) logger.warn(w);
  }

  return { passed, missing, warnings, summary };
}

export function requireConfig(): void {
  const report = validateConfig();
  if (!report.passed) {
    console.error("\n=========================================");
    console.error("  AITCOIN AI Layer — CONFIG ERROR");
    console.error("=========================================");
    for (const m of report.missing) console.error("  " + m);
    console.error("\n  Salin .env.example → .env dan isi nilai yang dibutuhkan.");
    console.error("=========================================\n");
    process.exit(1);
  }
}
