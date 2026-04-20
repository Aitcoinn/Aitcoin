import { logger } from '../lib/logger.js';

/**
 * ECONOMIC_ENGINE — Module #317
 * Economic system and market simulation
 * Kategori: MESIN & SISTEM
 */
export interface EconomicEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EconomicEngine {
  private states: Map<string, EconomicEngineState> = new Map();

  private getOrCreate(entityId: string): EconomicEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EconomicEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'economic_engine', value: state.value }, '[EconomicEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'economic_engine' }, '[EconomicEngine] Reset');
  }

  getState(entityId: string): EconomicEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EconomicEngineState> {
    return this.states;
  }
}

export const economicEngine = new EconomicEngine();
export default economicEngine;
