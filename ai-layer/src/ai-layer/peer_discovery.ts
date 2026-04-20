import { logger } from '../lib/logger.js';

/**
 * PEER_DISCOVERY — Module #515
 * Peer discovery and registration
 * Kategori: JARINGAN & KONEKSI
 */
export interface PeerDiscoveryState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PeerDiscovery {
  private states: Map<string, PeerDiscoveryState> = new Map();

  private getOrCreate(entityId: string): PeerDiscoveryState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PeerDiscoveryState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'peer_discovery', value: state.value }, '[PeerDiscovery] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'peer_discovery' }, '[PeerDiscovery] Reset');
  }

  getState(entityId: string): PeerDiscoveryState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PeerDiscoveryState> {
    return this.states;
  }
}

export const peerDiscovery = new PeerDiscovery();
export default peerDiscovery;
