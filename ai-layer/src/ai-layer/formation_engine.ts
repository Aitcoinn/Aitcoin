import { logger } from '../lib/logger.js';

/**
 * FORMATION_ENGINE — Module #335
 * Formation and group arrangement engine
 * Kategori: MESIN & SISTEM
 */
export interface FormationEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FormationEngine {
  private states: Map<string, FormationEngineState> = new Map();

  private getOrCreate(entityId: string): FormationEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FormationEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'formation_engine', value: state.value }, '[FormationEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'formation_engine' }, '[FormationEngine] Reset');
  }

  getState(entityId: string): FormationEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FormationEngineState> {
    return this.states;
  }
}

export const formationEngine = new FormationEngine();
export default formationEngine;
