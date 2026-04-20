// ============================================================
// ROUTES/AI/VALIDATE.TS — AI Block Validation Endpoint
//
// Endpoint: POST /api/ai/validate
//
// Menerima data block dari C++ node dan mengembalikan:
//   { score: number, risk: string, decision: string }
//
// PRINSIP UTAMA:
//   - AI hanya sebagai ADVISORY layer
//   - Blockchain tetap menjadi final authority
//   - Semua error dikembalikan sebagai "approve" (failsafe)
// ============================================================

import { Router, type IRouter } from "express";
import { logger } from "../../lib/logger.js";

const router: IRouter = Router();

// ── RISK SCORING THRESHOLDS ──────────────────────────────────
const RISK_THRESHOLDS = {
  HIGH_TX_COUNT:      1000,   // Block dengan > 1000 tx dianggap mencurigakan
  MAX_NONCE:          0xFFFFFFFF,
  SUSPICIOUS_VERSION: 0,      // Version 0 tidak normal
  FUTURE_TIMESTAMP:   300,    // Block timestamp > 5 menit ke depan (detik)
};

// ── TYPES ────────────────────────────────────────────────────
interface BlockValidationRequest {
  hash:       string;
  version?:   number;
  prevHash?:  string;
  merkleRoot?: string;
  timestamp?: number;
  bits?:      number;
  nonce?:     number;
  txCount?:   number;
  txids?:     string[];
}

interface AIValidationResponse {
  score:    number;   // 0.0 – 1.0
  risk:     string;   // "low" | "medium" | "high" | "critical"
  decision: string;   // "approve" | "warn" | "reject"
  reasons?: string[]; // Alasan flags (opsional, untuk debugging)
}

// ── FAILSAFE: Default response jika terjadi error ────────────
const SAFE_APPROVE: AIValidationResponse = {
  score:    1.0,
  risk:     "low",
  decision: "approve",
};

// ── ANALYZE BLOCK: Heuristic scoring ─────────────────────────
function analyzeBlock(req: BlockValidationRequest): AIValidationResponse {
  let score  = 1.0;
  const reasons: string[] = [];

  const now = Math.floor(Date.now() / 1000);

  // ── 1. Cek timestamp ──────────────────────────────────────
  if (req.timestamp !== undefined) {
    const timeDiff = req.timestamp - now;
    if (timeDiff > RISK_THRESHOLDS.FUTURE_TIMESTAMP) {
      score -= 0.2;
      reasons.push(`timestamp_future: ${timeDiff}s ahead`);
    }
    // Timestamp sangat jauh di masa lalu (> 2 jam) — kemungkinan replay
    if (timeDiff < -7200) {
      score -= 0.15;
      reasons.push(`timestamp_old: ${Math.abs(timeDiff)}s behind`);
    }
  }

  // ── 2. Cek jumlah transaksi ───────────────────────────────
  if (req.txCount !== undefined) {
    if (req.txCount === 0) {
      score -= 0.3;
      reasons.push("empty_block: no transactions");
    } else if (req.txCount > RISK_THRESHOLDS.HIGH_TX_COUNT) {
      score -= 0.1;
      reasons.push(`high_tx_count: ${req.txCount}`);
    }
  }

  // ── 3. Cek version ────────────────────────────────────────
  if (req.version !== undefined) {
    if (req.version === RISK_THRESHOLDS.SUSPICIOUS_VERSION) {
      score -= 0.25;
      reasons.push("version_zero: suspicious block version");
    }
    if (req.version < 0) {
      score -= 0.4;
      reasons.push(`version_negative: ${req.version}`);
    }
  }

  // ── 4. Cek hash validity (harus 64 hex chars) ────────────
  if (req.hash) {
    if (!/^[0-9a-fA-F]{64}$/.test(req.hash)) {
      score -= 0.5;
      reasons.push("invalid_hash_format");
    }
  }

  // ── 5. Cek prevHash ───────────────────────────────────────
  if (req.prevHash) {
    if (!/^[0-9a-fA-F]{64}$/.test(req.prevHash)) {
      score -= 0.3;
      reasons.push("invalid_prevhash_format");
    }
    // All-zeros prevHash hanya valid di genesis block
    if (req.prevHash === "0".repeat(64) && req.timestamp && req.timestamp > 1700000000) {
      score -= 0.1;
      reasons.push("genesis_prevhash_on_non_genesis");
    }
  }

  // ── 6. Cek duplikat txids ─────────────────────────────────
  if (req.txids && req.txids.length > 1) {
    const unique = new Set(req.txids);
    if (unique.size < req.txids.length) {
      score -= 0.35;
      reasons.push(`duplicate_txids: ${req.txids.length - unique.size} duplicates`);
    }
  }

  // ── Clamp score ───────────────────────────────────────────
  score = Math.max(0.0, Math.min(1.0, score));

  // ── Tentukan risk level ───────────────────────────────────
  let risk: string;
  let decision: string;

  if (score >= 0.8) {
    risk     = "low";
    decision = "approve";
  } else if (score >= 0.6) {
    risk     = "medium";
    decision = "warn";
  } else if (score >= 0.35) {
    risk     = "high";
    decision = "warn";
  } else {
    risk     = "critical";
    decision = "reject";
  }

  return {
    score:   parseFloat(score.toFixed(4)),
    risk,
    decision,
    reasons: reasons.length > 0 ? reasons : undefined,
  };
}

// ── POST /ai/validate ─────────────────────────────────────────
// Menerima data block dari C++ node dan mengembalikan skor AI
router.post("/ai/validate", (req, res) => {
  try {
    const body = req.body as BlockValidationRequest;

    // Validasi minimal: harus ada hash
    if (!body || typeof body !== "object" || !body.hash) {
      logger.warn("[AI-Validate] Invalid request — missing block hash");
      // Failsafe: return approve jika request tidak valid
      res.json(SAFE_APPROVE);
      return;
    }

    const result = analyzeBlock(body);

    logger.info({
      block:    body.hash.slice(0, 16),
      score:    result.score,
      risk:     result.risk,
      decision: result.decision,
      reasons:  result.reasons,
      txCount:  body.txCount,
    }, "[AI-Validate] Block analyzed");

    res.json(result);
  } catch (err) {
    logger.error({ err }, "[AI-Validate] Error during block validation — returning safe approve");
    // FAILSAFE: Jika AI error, selalu approve
    // Blockchain tidak boleh bergantung penuh pada AI
    res.json(SAFE_APPROVE);
  }
});

// ── GET /ai/validate/status ───────────────────────────────────
// Health check khusus untuk AI validator subsystem
router.get("/ai/validate/status", (_req, res) => {
  res.json({
    status:      "online",
    mode:        "advisory",
    description: "AI Advisory Validator — blockchain is final authority",
    thresholds:  RISK_THRESHOLDS,
    timestamp:   Date.now(),
  });
});

export default router;
