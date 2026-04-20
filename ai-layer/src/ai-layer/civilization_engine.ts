import { logger } from '../lib/logger.js';

/**
 * CIVILIZATION_ENGINE — Module #802
 * Civilization development engine
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CivilizationEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CivilizationEngine {
  private states: Map<string, CivilizationEngineState> = new Map();

  private getOrCreate(entityId: string): CivilizationEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CivilizationEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'civilization_engine', value: state.value }, '[CivilizationEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'civilization_engine' }, '[CivilizationEngine] Reset');
  }

  getState(entityId: string): CivilizationEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CivilizationEngineState> {
    return this.states;
  }
}

export const civilizationEngine = new CivilizationEngine();
export default civilizationEngine;
