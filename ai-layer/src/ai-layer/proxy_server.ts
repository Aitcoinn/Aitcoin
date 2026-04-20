import { logger } from '../lib/logger.js';

/**
 * PROXY_SERVER — Module #565
 * Network proxy server
 * Kategori: JARINGAN & KONEKSI
 */
export interface ProxyServerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ProxyServer {
  private states: Map<string, ProxyServerState> = new Map();

  private getOrCreate(entityId: string): ProxyServerState {
    if (!this.states.has(entityId)) {
      this.states.set(entityId, {
        entityId,
        active: false,
        value: 0,
        data: {},
        updatedAt: Date.now(),
      });
    }
    return this.states.get(entityId)!;
  }

  execute(entityId: string, input: Record<string, unknown> = {}): ProxyServerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'proxy_server', value: state.value }, '[ProxyServer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'proxy_server' }, '[ProxyServer] Reset');
  }

  getState(entityId: string): ProxyServerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ProxyServerState> {
    return this.states;
  }
}

export const proxyServer = new ProxyServer();
export default proxyServer;
