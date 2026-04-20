import { logger } from '../lib/logger.js';

/**
 * POLITICAL_ENGINE — Module #318
 * Political dynamics and governance simulation
 * Kategori: MESIN & SISTEM
 */
export interface PoliticalEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PoliticalEngine {
  private states: Map<string, PoliticalEngineState> = new Map();

  private getOrCreate(entityId: string): PoliticalEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PoliticalEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'political_engine', value: state.value }, '[PoliticalEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'political_engine' }, '[PoliticalEngine] Reset');
  }

  getState(entityId: string): PoliticalEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PoliticalEngineState> {
    return this.states;
  }
}

export const politicalEngine = new PoliticalEngine();
export default politicalEngine;
