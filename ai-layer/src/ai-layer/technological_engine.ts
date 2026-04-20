import { logger } from '../lib/logger.js';

/**
 * TECHNOLOGICAL_ENGINE — Module #320
 * Technology development and innovation engine
 * Kategori: MESIN & SISTEM
 */
export interface TechnologicalEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TechnologicalEngine {
  private states: Map<string, TechnologicalEngineState> = new Map();

  private getOrCreate(entityId: string): TechnologicalEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TechnologicalEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'technological_engine', value: state.value }, '[TechnologicalEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'technological_engine' }, '[TechnologicalEngine] Reset');
  }

  getState(entityId: string): TechnologicalEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TechnologicalEngineState> {
    return this.states;
  }
}

export const technologicalEngine = new TechnologicalEngine();
export default technologicalEngine;
