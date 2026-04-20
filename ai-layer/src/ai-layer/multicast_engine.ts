import { logger } from '../lib/logger.js';

/**
 * MULTICAST_ENGINE — Module #530
 * Multicast transmission engine
 * Kategori: JARINGAN & KONEKSI
 */
export interface MulticastEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MulticastEngine {
  private states: Map<string, MulticastEngineState> = new Map();

  private getOrCreate(entityId: string): MulticastEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MulticastEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'multicast_engine', value: state.value }, '[MulticastEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'multicast_engine' }, '[MulticastEngine] Reset');
  }

  getState(entityId: string): MulticastEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MulticastEngineState> {
    return this.states;
  }
}

export const multicastEngine = new MulticastEngine();
export default multicastEngine;
