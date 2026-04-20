import { logger } from '../lib/logger.js';

/**
 * CHAOS_ENGINE_V2 — Module #338
 * Advanced chaos and entropy management
 * Kategori: MESIN & SISTEM
 */
export interface ChaosEngineV2State {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChaosEngineV2 {
  private states: Map<string, ChaosEngineV2State> = new Map();

  private getOrCreate(entityId: string): ChaosEngineV2State {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChaosEngineV2State {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'chaos_engine_v2', value: state.value }, '[ChaosEngineV2] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'chaos_engine_v2' }, '[ChaosEngineV2] Reset');
  }

  getState(entityId: string): ChaosEngineV2State | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChaosEngineV2State> {
    return this.states;
  }
}

export const chaosEngineV2 = new ChaosEngineV2();
export default chaosEngineV2;
