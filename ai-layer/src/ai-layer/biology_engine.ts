import { logger } from '../lib/logger.js';

/**
 * BIOLOGY_ENGINE — Module #315
 * Biological system simulation
 * Kategori: MESIN & SISTEM
 */
export interface BiologyEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BiologyEngine {
  private states: Map<string, BiologyEngineState> = new Map();

  private getOrCreate(entityId: string): BiologyEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BiologyEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'biology_engine', value: state.value }, '[BiologyEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'biology_engine' }, '[BiologyEngine] Reset');
  }

  getState(entityId: string): BiologyEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BiologyEngineState> {
    return this.states;
  }
}

export const biologyEngine = new BiologyEngine();
export default biologyEngine;
