import { logger } from '../lib/logger.js';

/**
 * SINGLETON_SYSTEM — Module #385
 * Singleton instance management
 * Kategori: MESIN & SISTEM
 */
export interface SingletonSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SingletonSystem {
  private states: Map<string, SingletonSystemState> = new Map();

  private getOrCreate(entityId: string): SingletonSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SingletonSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'singleton_system', value: state.value }, '[SingletonSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'singleton_system' }, '[SingletonSystem] Reset');
  }

  getState(entityId: string): SingletonSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SingletonSystemState> {
    return this.states;
  }
}

export const singletonSystem = new SingletonSystem();
export default singletonSystem;
