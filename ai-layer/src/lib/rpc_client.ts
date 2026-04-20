// ============================================================
// RPC_CLIENT.TS — Typed Client untuk AITCOIN C++ Node
// Berkomunikasi dengan node Bitcoin fork via JSON-RPC 1.0
// Tidak butuh dependency baru — pakai fetch bawaan Node 18+
// ============================================================

import { logger } from "./logger.js";

export interface RpcConfig {
  url:      string;   // e.g. http://127.0.0.1:8332
  user:     string;
  pass:     string;
  timeout?: number;   // ms, default 10000
}

export interface RpcBlockchainInfo {
  chain:             string;
  blocks:            number;
  headers:           number;
  bestblockhash:     string;
  difficulty:        number;
  verificationprogress: number;
  pruned:            boolean;
}

export interface RpcNetworkInfo {
  version:        number;
  subversion:     string;
  connections:    number;
  relayfee:       number;
  incrementalfee: number;
}

export interface RpcMiningInfo {
  blocks:           number;
  difficulty:       number;
  networkhashps:    number;
  pooledtx:         number;
  chain:            string;
}

export interface RpcAddressInfo {
  address:          string;
  isvalid:          boolean;
  scriptPubKey?:    string;
  ismine?:          boolean;
  iswatchonly?:     boolean;
}

export interface RpcBlock {
  hash:             string;
  confirmations:    number;
  height:           number;
  time:             number;
  tx:               string[];
  nTx:              number;
  difficulty:       number;
}

class AitcoinRpcClient {
  private cfg: RpcConfig | null = null;

  configure(cfg: RpcConfig): void {
    this.cfg = cfg;
    logger.info({ url: cfg.url }, "[RPC] AITCOIN node configured");
  }

  private getConfig(): RpcConfig {
    if (this.cfg) return this.cfg;
    const url  = process.env["AITCOIN_RPC_URL"]  ?? "";
    const user = process.env["AITCOIN_RPC_USER"] ?? "";
    const pass = process.env["AITCOIN_RPC_PASS"] ?? "";
    if (!url) throw new Error("AITCOIN_RPC_URL not configured");
    return { url, user, pass };
  }

  async call<T>(method: string, params: unknown[] = []): Promise<T> {
    const cfg  = this.getConfig();
    const auth = Buffer.from(`${cfg.user}:${cfg.pass}`).toString("base64");

    const response = await fetch(cfg.url, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body:   JSON.stringify({ jsonrpc: "1.0", id: "aitcoin-ai", method, params }),
      signal: AbortSignal.timeout(cfg.timeout ?? 10_000),
    });

    if (!response.ok) {
      throw new Error(`RPC HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { result: T; error: { code: number; message: string } | null };
    if (data.error) throw new Error(`RPC error [${data.error.code}]: ${data.error.message}`);
    return data.result;
  }

  // ── HIGH-LEVEL TYPED METHODS ──────────────────────────────

  async getBlockchainInfo(): Promise<RpcBlockchainInfo> {
    return this.call<RpcBlockchainInfo>("getblockchaininfo");
  }

  async getNetworkInfo(): Promise<RpcNetworkInfo> {
    return this.call<RpcNetworkInfo>("getnetworkinfo");
  }

  async getMiningInfo(): Promise<RpcMiningInfo> {
    return this.call<RpcMiningInfo>("getmininginfo");
  }

  async getBlockCount(): Promise<number> {
    return this.call<number>("getblockcount");
  }

  async getBestBlockHash(): Promise<string> {
    return this.call<string>("getbestblockhash");
  }

  async getBlock(hash: string, verbosity = 1): Promise<RpcBlock> {
    return this.call<RpcBlock>("getblock", [hash, verbosity]);
  }

  async validateAddress(address: string): Promise<RpcAddressInfo> {
    return this.call<RpcAddressInfo>("validateaddress", [address]);
  }

  async getBalance(account = ""): Promise<number> {
    return this.call<number>("getbalance", [account]);
  }

  async isAlive(): Promise<boolean> {
    try {
      await this.getBlockCount();
      return true;
    } catch {
      return false;
    }
  }

  async getSyncStatus(): Promise<{ synced: boolean; progress: number; blocks: number; headers: number }> {
    try {
      const info = await this.getBlockchainInfo();
      return {
        synced:   info.verificationprogress >= 0.9999,
        progress: Math.round(info.verificationprogress * 100 * 100) / 100,
        blocks:   info.blocks,
        headers:  info.headers,
      };
    } catch {
      return { synced: false, progress: 0, blocks: 0, headers: 0 };
    }
  }
}

// Singleton — satu instance untuk seluruh proses
export const rpcClient = new AitcoinRpcClient();
