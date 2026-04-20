import { logger } from '../lib/logger.js';

/**
 * CHANGE_ENGINE — Module #323
 * Change management and adaptation engine
 * Kategori: MESIN & SISTEM
 */
export interface ChangeEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChangeEngine {
  private states: Map<string, ChangeEngineState> = new Map();

  private getOrCreate(entityId: string): ChangeEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChangeEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'change_engine', value: state.value }, '[ChangeEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'change_engine' }, '[ChangeEngine] Reset');
  }

  getState(entityId: string): ChangeEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChangeEngineState> {
    return this.states;
  }
}

export const changeEngine = new ChangeEngine();
export default changeEngine;
