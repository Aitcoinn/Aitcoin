import { logger } from '../lib/logger.js';

/**
 * WORMHOLE_TRANSIT — Module #593
 * Wormhole-based transit system
 * Kategori: JARINGAN & KONEKSI
 */
export interface WormholeTransitState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WormholeTransit {
  private states: Map<string, WormholeTransitState> = new Map();

  private getOrCreate(entityId: string): WormholeTransitState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WormholeTransitState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'wormhole_transit', value: state.value }, '[WormholeTransit] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'wormhole_transit' }, '[WormholeTransit] Reset');
  }

  getState(entityId: string): WormholeTransitState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WormholeTransitState> {
    return this.states;
  }
}

export const wormholeTransit = new WormholeTransit();
export default wormholeTransit;
