import { logger } from '../lib/logger.js';

/**
 * CALMNESS_BRINGER — Module #963
 * Calmness induction system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface CalmnessBringerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CalmnessBringer {
  private states: Map<string, CalmnessBringerState> = new Map();

  private getOrCreate(entityId: string): CalmnessBringerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CalmnessBringerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'calmness_bringer', value: state.value }, '[CalmnessBringer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'calmness_bringer' }, '[CalmnessBringer] Reset');
  }

  getState(entityId: string): CalmnessBringerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CalmnessBringerState> {
    return this.states;
  }
}

export const calmnessBringer = new CalmnessBringer();
export default calmnessBringer;
