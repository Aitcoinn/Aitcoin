import { logger } from '../lib/logger.js';

/**
 * RANDOM_ENGINE — Module #339
 * Controlled randomness and stochastic processes
 * Kategori: MESIN & SISTEM
 */
export interface RandomEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RandomEngine {
  private states: Map<string, RandomEngineState> = new Map();

  private getOrCreate(entityId: string): RandomEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RandomEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'random_engine', value: state.value }, '[RandomEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'random_engine' }, '[RandomEngine] Reset');
  }

  getState(entityId: string): RandomEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RandomEngineState> {
    return this.states;
  }
}

export const randomEngine = new RandomEngine();
export default randomEngine;
