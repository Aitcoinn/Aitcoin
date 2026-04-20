import { logger } from '../lib/logger.js';

/**
 * HALLUCINATION_ENGINE — Module #745
 * Controlled hallucination engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface HallucinationEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HallucinationEngine {
  private states: Map<string, HallucinationEngineState> = new Map();

  private getOrCreate(entityId: string): HallucinationEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HallucinationEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'hallucination_engine', value: state.value }, '[HallucinationEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'hallucination_engine' }, '[HallucinationEngine] Reset');
  }

  getState(entityId: string): HallucinationEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HallucinationEngineState> {
    return this.states;
  }
}

export const hallucinationEngine = new HallucinationEngine();
export default hallucinationEngine;
