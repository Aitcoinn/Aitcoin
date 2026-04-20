import { logger } from '../lib/logger.js';

/**
 * JITTER_REDUCER — Module #525
 * Network jitter reduction
 * Kategori: JARINGAN & KONEKSI
 */
export interface JitterReducerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class JitterReducer {
  private states: Map<string, JitterReducerState> = new Map();

  private getOrCreate(entityId: string): JitterReducerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): JitterReducerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'jitter_reducer', value: state.value }, '[JitterReducer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'jitter_reducer' }, '[JitterReducer] Reset');
  }

  getState(entityId: string): JitterReducerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, JitterReducerState> {
    return this.states;
  }
}

export const jitterReducer = new JitterReducer();
export default jitterReducer;
