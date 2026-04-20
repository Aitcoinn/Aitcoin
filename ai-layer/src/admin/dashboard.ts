// ============================================================
// ADMIN/DASHBOARD.TS — Simple HTML Admin Dashboard
// Tidak butuh dependency baru — pure HTML dari Express
// Akses: GET /admin
// ============================================================

import { Router } from "express";
import { getLocalWalletStatus } from "../ecosystem/wallet_local.js";
import { isDbAvailable } from "../lib/db.js";

const router = Router();

function html(content: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AITCOIN Node Dashboard</title>
  <style>
    :root { --gold: #f7c94b; --dark: #0d0d0d; --card: #1a1a1a; --border: #2a2a2a; --green: #22c55e; --red: #ef4444; --gray: #6b7280; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--dark); color: #e5e7eb; font-family: 'Courier New', monospace; padding: 24px; }
    h1 { color: var(--gold); font-size: 1.5rem; margin-bottom: 4px; }
    .subtitle { color: var(--gray); font-size: 0.8rem; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 20px; }
    .card h2 { color: var(--gold); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
    .row:last-child { border-bottom: none; }
    .label { color: var(--gray); }
    .value { color: #e5e7eb; font-weight: bold; }
    .ok    { color: var(--green); }
    .warn  { color: #f59e0b; }
    .error { color: var(--red); }
    .address { font-size: 0.7rem; word-break: break-all; color: var(--gold); }
    .refresh { margin-top: 24px; text-align: center; color: var(--gray); font-size: 0.75rem; }
    a { color: var(--gold); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .api-list { list-style: none; }
    .api-list li { padding: 4px 0; font-size: 0.8rem; }
    .method { background: #1e3a5f; color: #60a5fa; padding: 1px 6px; border-radius: 3px; font-size: 0.7rem; margin-right: 6px; }
    .method.post { background: #1e3f1e; color: #4ade80; }
  </style>
  <meta http-equiv="refresh" content="30">
</head>
<body>
${content}
<div class="refresh">Auto-refresh setiap 30 detik | <a href="/admin">Refresh sekarang</a> | <a href="/api/node/health" target="_blank">Health JSON</a></div>
</body>
</html>`;
}

const START_TIME = Date.now();

router.get("/admin", (_req, res) => {
  const wallet  = getLocalWalletStatus();
  const upMs    = Date.now() - START_TIME;
  const upSec   = Math.floor(upMs / 1000);
  const upStr   = upSec > 3600
    ? `${Math.floor(upSec/3600)}h ${Math.floor((upSec%3600)/60)}m`
    : `${Math.floor(upSec/60)}m ${upSec%60}s`;

  const mem     = process.memoryUsage();
  const mb      = (n: number) => (n / 1024 / 1024).toFixed(1);

  const dbStatus  = isDbAvailable() ? "ok" : "offline";
  const walletOk  = wallet.initialized;
  const progress  = wallet.vestingProgress ?? "N/A";

  const content = `
<h1>⬡ AITCOIN Node Dashboard</h1>
<p class="subtitle">AI Layer v2 — ${new Date().toLocaleString("id-ID")}</p>

<div class="grid">

  <div class="card">
    <h2>🖥 Node Status</h2>
    <div class="row"><span class="label">Status</span><span class="value ok">● ONLINE</span></div>
    <div class="row"><span class="label">Node Type</span><span class="value">${process.env["NODE_TYPE"] ?? "AI_NODE"}</span></div>
    <div class="row"><span class="label">Node ID</span><span class="value">${process.env["NODE_ID"] ?? "auto"}</span></div>
    <div class="row"><span class="label">Uptime</span><span class="value">${upStr}</span></div>
    <div class="row"><span class="label">Node.js</span><span class="value">${process.version}</span></div>
    <div class="row"><span class="label">P2P Port</span><span class="value">${process.env["P2P_PORT"] ?? "9080"}</span></div>
  </div>

  <div class="card">
    <h2>💳 Development Wallet</h2>
    <div class="row"><span class="label">Status</span><span class="value ${walletOk ? "ok" : "warn"}">${walletOk ? "✅ Aktif (Lokal)" : "⚠️ Belum Diinit"}</span></div>
    ${walletOk ? `
    <div class="row" style="flex-direction:column;align-items:flex-start;gap:4px">
      <span class="label">Address</span>
      <span class="address">${wallet.walletAddress}</span>
    </div>
    <div class="row"><span class="label">Total Allocated</span><span class="value">${wallet.totalAllocated?.toLocaleString()} ATC</span></div>
    <div class="row"><span class="label">Total Claimed</span><span class="value">${wallet.totalClaimed?.toLocaleString()} ATC</span></div>
    <div class="row"><span class="label">Free Claimed</span><span class="value">${wallet.freeClaimed ? "✅ Ya" : "❌ Belum"}</span></div>
    <div class="row"><span class="label">Vesting</span><span class="value">${progress}</span></div>
    <div class="row"><span class="label">Tersedia Sekarang</span><span class="value ok">${wallet.availableNow?.toLocaleString()} ATC</span></div>
    ` : '<div class="row"><span class="value warn">Jalankan: pnpm wallet:init</span></div>'}
  </div>

  <div class="card">
    <h2>🗄 Sistem</h2>
    <div class="row"><span class="label">Database</span><span class="value ${dbStatus === "ok" ? "ok" : "warn"}">${dbStatus === "ok" ? "✅ Terhubung" : "⚠️ Offline (opsional)"}</span></div>
    <div class="row"><span class="label">Blockchain RPC</span><span class="value warn">${process.env["AITCOIN_RPC_URL"] ? "Dikonfigurasi" : "⚠️ Belum diset"}</span></div>
    <div class="row"><span class="label">Memory RSS</span><span class="value">${mb(mem.rss)} MB</span></div>
    <div class="row"><span class="label">Heap Used</span><span class="value">${mb(mem.heapUsed)} MB</span></div>
    <div class="row"><span class="label">Heap Total</span><span class="value">${mb(mem.heapTotal)} MB</span></div>
  </div>

  <div class="card">
    <h2>🌐 API Endpoints</h2>
    <ul class="api-list">
      <li><span class="method">GET</span> <a href="/api/node/info" target="_blank">/api/node/info</a></li>
      <li><span class="method">GET</span> <a href="/api/node/health" target="_blank">/api/node/health</a></li>
      <li><span class="method">GET</span> <a href="/api/node/blockchain" target="_blank">/api/node/blockchain</a></li>
      <li><span class="method">GET</span> <a href="/api/wallet/status/${wallet.walletAddress ?? 'ADDRESS'}" target="_blank">/api/wallet/status</a></li>
      <li><span class="method">GET</span> <a href="/api/wallet/schedule/${wallet.walletAddress ?? 'ADDRESS'}" target="_blank">/api/wallet/schedule</a></li>
      <li><span class="method post">POST</span> /api/wallet/claim/free</li>
      <li><span class="method post">POST</span> /api/wallet/claim/vesting</li>
      <li><span class="method">GET</span> <a href="/api/developer/status" target="_blank">/api/developer/status</a></li>
      <li><span class="method">GET</span> <a href="/api/developer/security" target="_blank">/api/developer/security</a></li>
      <li><span class="method">GET</span> <a href="/api/developer/scale" target="_blank">/api/developer/scale</a></li>
      <li><span class="method">GET</span> <a href="/healthz" target="_blank">/healthz</a></li>
    </ul>
  </div>

</div>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html(content));
});

export default router;
