import { logger } from '../lib/logger.js';

/**
 * ACTION_ENGINE — Module #325
 * Action selection and execution engine
 * Kategori: MESIN & SISTEM
 */
export interface ActionEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ActionEngine {
  private states: Map<string, ActionEngineState> = new Map();

  private getOrCreate(entityId: string): ActionEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ActionEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'action_engine', value: state.value }, '[ActionEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'action_engine' }, '[ActionEngine] Reset');
  }

  getState(entityId: string): ActionEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ActionEngineState> {
    return this.states;
  }
}

export const actionEngine = new ActionEngine();
export default actionEngine;
