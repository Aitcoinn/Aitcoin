// ============================================================
// PEER_EXCHANGE.TS — Automatic Peer Discovery (PEX)
// Mirip protokol Bitcoin addr/getaddr
// Node baru tidak perlu daftar manual — otomatis temukan peer
// ============================================================

import { broadcast, receiveMessage, connectToPeer, NODE_ID } from "./p2p_network.js";
import { nodeRegistry } from "./node_registry.js";
import { logger } from "../lib/logger.js";

const MAX_PEERS_TO_SHARE = 25;   // max per exchange
const PEX_INTERVAL_MS    = 60_000;  // setiap 1 menit
const BOOTSTRAP_NODES    = (process.env["BOOTSTRAP_NODES"] ?? "").split(",").filter(Boolean);

// ── STRUKTUR PEER EXCHANGE MESSAGE ────────────────────────────
export interface PexPeer {
  nodeId:   string;
  address:  string;
  port:     number;
  nodeType: string;
}

// ── INIT: Daftar handler untuk pesan PEX ────────────────────
export function initPeerExchange(): void {
  // Handle GETADDR — peer minta daftar teman kita
  receiveMessage((msg) => {
    if (msg.type !== "PEER_DISCOVERY") return;

    if ((msg.payload as Record<string, unknown>)["request"] === "GETADDR") {
      const peers = nodeRegistry.getAllNodes()
        .filter(p => p.nodeId !== msg.from && p.nodeId !== NODE_ID)
        .slice(0, MAX_PEERS_TO_SHARE)
        .map(p => ({ nodeId: p.nodeId, address: p.address, port: p.port, nodeType: p.nodeType }));

      broadcast({
        type:      "PEER_DISCOVERY",
        from:      NODE_ID,
        to:        msg.from,
        payload:   { type: "ADDR", peers },
        timestamp: Date.now(),
      });

      logger.debug({ to: msg.from, peerCount: peers.length }, "[PEX] Responded to GETADDR");
    }

    // Handle ADDR — terima daftar peer baru
    if ((msg.payload as Record<string, unknown>)["type"] === "ADDR") {
      const incoming = ((msg.payload as Record<string, unknown>)["peers"] ?? []) as PexPeer[];
      let connected = 0;

      for (const peer of incoming) {
        if (peer.nodeId === NODE_ID) continue;
        if (nodeRegistry.getAllNodes().find(n => n.nodeId === peer.nodeId)) continue;

        // Coba hubungkan ke peer baru
        try {
          const wsAddr = `ws://${peer.address}:${peer.port}`;
          connectToPeer(wsAddr);
          connected++;
          logger.info({ nodeId: peer.nodeId, wsAddr }, "[PEX] Discovered & connecting to new peer");
        } catch { /* ignore connection failure */ }
      }

      if (connected > 0) logger.info({ count: connected }, "[PEX] Connected to new peers via exchange");
    }
  });

  // Mulai periodic PEX
  setInterval(requestPeerList, PEX_INTERVAL_MS);

  logger.info({ bootstrapCount: BOOTSTRAP_NODES.length }, "[PEX] Peer Exchange initialized");
}

// ── REQUEST — Minta daftar peer dari jaringan ────────────────
export function requestPeerList(): void {
  broadcast({
    type:      "PEER_DISCOVERY",
    from:      NODE_ID,
    payload:   { request: "GETADDR" },
    timestamp: Date.now(),
  });
  logger.debug("[PEX] Broadcast GETADDR to all peers");
}

// ── BOOTSTRAP — Hubungkan ke node awal yang dikenal ─────────
// Node baru hanya perlu satu peer untuk mulai — setelah itu PEX otomatis
export function connectToBootstrapNodes(): void {
  if (BOOTSTRAP_NODES.length === 0) {
    logger.info("[PEX] No BOOTSTRAP_NODES set — running isolated or waiting for incoming connections");
    return;
  }

  for (const addr of BOOTSTRAP_NODES) {
    try {
      connectToPeer(addr.trim());
      logger.info({ addr }, "[PEX] Bootstrap: connecting to seed node");
    } catch { /* ignore */ }
  }

  // Setelah terhubung, langsung minta daftar peer
  setTimeout(requestPeerList, 3000);
}

// ── DNS SEED RESOLUTION — Opsional (untuk publik network) ────
// Format BOOTSTRAP_NODES: ws://seed1.aitcoin.io:9080,ws://seed2.aitcoin.io:9080
export function getBootstrapNodes(): string[] {
  return BOOTSTRAP_NODES;
}
