import { logger } from '../lib/logger.js';

/**
 * REPEAT_ENGINE — Module #356
 * Repetition and iteration engine
 * Kategori: MESIN & SISTEM
 */
export interface RepeatEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RepeatEngine {
  private states: Map<string, RepeatEngineState> = new Map();

  private getOrCreate(entityId: string): RepeatEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RepeatEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'repeat_engine', value: state.value }, '[RepeatEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'repeat_engine' }, '[RepeatEngine] Reset');
  }

  getState(entityId: string): RepeatEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RepeatEngineState> {
    return this.states;
  }
}

export const repeatEngine = new RepeatEngine();
export default repeatEngine;
