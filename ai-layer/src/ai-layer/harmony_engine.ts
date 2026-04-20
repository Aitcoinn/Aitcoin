import { logger } from '../lib/logger.js';

/**
 * HARMONY_ENGINE — Module #360
 * Harmony and balance maintenance engine
 * Kategori: MESIN & SISTEM
 */
export interface HarmonyEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HarmonyEngine {
  private states: Map<string, HarmonyEngineState> = new Map();

  private getOrCreate(entityId: string): HarmonyEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HarmonyEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'harmony_engine', value: state.value }, '[HarmonyEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'harmony_engine' }, '[HarmonyEngine] Reset');
  }

  getState(entityId: string): HarmonyEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HarmonyEngineState> {
    return this.states;
  }
}

export const harmonyEngine = new HarmonyEngine();
export default harmonyEngine;
