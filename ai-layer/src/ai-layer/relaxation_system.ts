import { logger } from '../lib/logger.js';

/**
 * RELAXATION_SYSTEM — Module #964
 * Relaxation management system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface RelaxationSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RelaxationSystem {
  private states: Map<string, RelaxationSystemState> = new Map();

  private getOrCreate(entityId: string): RelaxationSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RelaxationSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'relaxation_system', value: state.value }, '[RelaxationSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'relaxation_system' }, '[RelaxationSystem] Reset');
  }

  getState(entityId: string): RelaxationSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RelaxationSystemState> {
    return this.states;
  }
}

export const relaxationSystem = new RelaxationSystem();
export default relaxationSystem;
