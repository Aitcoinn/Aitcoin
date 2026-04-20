import { logger } from '../lib/logger.js';

/**
 * ITERATOR_SYSTEM — Module #398
 * Advanced iteration management
 * Kategori: MESIN & SISTEM
 */
export interface IteratorSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IteratorSystem {
  private states: Map<string, IteratorSystemState> = new Map();

  private getOrCreate(entityId: string): IteratorSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IteratorSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'iterator_system', value: state.value }, '[IteratorSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'iterator_system' }, '[IteratorSystem] Reset');
  }

  getState(entityId: string): IteratorSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IteratorSystemState> {
    return this.states;
  }
}

export const iteratorSystem = new IteratorSystem();
export default iteratorSystem;
