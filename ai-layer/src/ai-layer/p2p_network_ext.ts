import { logger } from '../lib/logger.js';

/**
 * P2P_NETWORK_EXT — Module #514
 * Extended peer-to-peer networking
 * Kategori: JARINGAN & KONEKSI
 */
export interface P2PNetworkExtState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class P2PNetworkExt {
  private states: Map<string, P2PNetworkExtState> = new Map();

  private getOrCreate(entityId: string): P2PNetworkExtState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): P2PNetworkExtState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'p2p_network_ext', value: state.value }, '[P2PNetworkExt] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'p2p_network_ext' }, '[P2PNetworkExt] Reset');
  }

  getState(entityId: string): P2PNetworkExtState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, P2PNetworkExtState> {
    return this.states;
  }
}

export const p2pNetworkExt = new P2PNetworkExt();
export default p2pNetworkExt;
