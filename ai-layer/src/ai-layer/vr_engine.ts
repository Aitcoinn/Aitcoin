import { logger } from '../lib/logger.js';

/**
 * VR_ENGINE — Module #726
 * Virtual reality engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface VREngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VREngine {
  private states: Map<string, VREngineState> = new Map();

  private getOrCreate(entityId: string): VREngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): VREngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'vr_engine', value: state.value }, '[VREngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'vr_engine' }, '[VREngine] Reset');
  }

  getState(entityId: string): VREngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VREngineState> {
    return this.states;
  }
}

export const vrEngine = new VREngine();
export default vrEngine;
