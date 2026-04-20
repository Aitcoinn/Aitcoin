import { logger } from '../lib/logger.js';

/**
 * DATA_LEAK_PREVENTER — Module #460
 * Data leakage prevention (DLP)
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface DataLeakPreventerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DataLeakPreventer {
  private states: Map<string, DataLeakPreventerState> = new Map();

  private getOrCreate(entityId: string): DataLeakPreventerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DataLeakPreventerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'data_leak_preventer', value: state.value }, '[DataLeakPreventer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'data_leak_preventer' }, '[DataLeakPreventer] Reset');
  }

  getState(entityId: string): DataLeakPreventerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DataLeakPreventerState> {
    return this.states;
  }
}

export const dataLeakPreventer = new DataLeakPreventer();
export default dataLeakPreventer;
