import { logger } from '../lib/logger.js';

/**
 * SIMPLIFIER_ENGINE — Module #620
 * Language simplification engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SimplifierEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SimplifierEngine {
  private states: Map<string, SimplifierEngineState> = new Map();

  private getOrCreate(entityId: string): SimplifierEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SimplifierEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'simplifier_engine', value: state.value }, '[SimplifierEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'simplifier_engine' }, '[SimplifierEngine] Reset');
  }

  getState(entityId: string): SimplifierEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SimplifierEngineState> {
    return this.states;
  }
}

export const simplifierEngine = new SimplifierEngine();
export default simplifierEngine;
