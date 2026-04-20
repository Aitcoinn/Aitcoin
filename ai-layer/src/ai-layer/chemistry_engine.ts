import { logger } from '../lib/logger.js';

/**
 * CHEMISTRY_ENGINE — Module #314
 * Chemical reaction and molecular simulation
 * Kategori: MESIN & SISTEM
 */
export interface ChemistryEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChemistryEngine {
  private states: Map<string, ChemistryEngineState> = new Map();

  private getOrCreate(entityId: string): ChemistryEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChemistryEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'chemistry_engine', value: state.value }, '[ChemistryEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'chemistry_engine' }, '[ChemistryEngine] Reset');
  }

  getState(entityId: string): ChemistryEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChemistryEngineState> {
    return this.states;
  }
}

export const chemistryEngine = new ChemistryEngine();
export default chemistryEngine;
