import { logger } from '../lib/logger.js';

/**
 * CORE_VALUE — Module #983
 * Core value system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface CoreValueState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CoreValue {
  private states: Map<string, CoreValueState> = new Map();

  private getOrCreate(entityId: string): CoreValueState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CoreValueState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'core_value', value: state.value }, '[CoreValue] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'core_value' }, '[CoreValue] Reset');
  }

  getState(entityId: string): CoreValueState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CoreValueState> {
    return this.states;
  }
}

export const coreValue = new CoreValue();
export default coreValue;
