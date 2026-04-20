import { logger } from '../lib/logger.js';

/**
 * EVOLUTION_ENGINE — Module #321
 * Evolutionary process simulation
 * Kategori: MESIN & SISTEM
 */
export interface EvolutionEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EvolutionEngine {
  private states: Map<string, EvolutionEngineState> = new Map();

  private getOrCreate(entityId: string): EvolutionEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EvolutionEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'evolution_engine', value: state.value }, '[EvolutionEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'evolution_engine' }, '[EvolutionEngine] Reset');
  }

  getState(entityId: string): EvolutionEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EvolutionEngineState> {
    return this.states;
  }
}

export const evolutionEngine = new EvolutionEngine();
export default evolutionEngine;
