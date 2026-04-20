import { logger } from '../lib/logger.js';

/**
 * AR_SYSTEM — Module #727
 * Augmented reality system
 * Kategori: PERSEPSI & REALITAS
 */
export interface ARSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ARSystem {
  private states: Map<string, ARSystemState> = new Map();

  private getOrCreate(entityId: string): ARSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ARSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ar_system', value: state.value }, '[ARSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ar_system' }, '[ARSystem] Reset');
  }

  getState(entityId: string): ARSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ARSystemState> {
    return this.states;
  }
}

export const arSystem = new ARSystem();
export default arSystem;
