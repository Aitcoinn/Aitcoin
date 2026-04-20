import { logger } from '../lib/logger.js';

/**
 * BEHAVIOR_ENGINE — Module #326
 * Behavior pattern generation engine
 * Kategori: MESIN & SISTEM
 */
export interface BehaviorEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BehaviorEngine {
  private states: Map<string, BehaviorEngineState> = new Map();

  private getOrCreate(entityId: string): BehaviorEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BehaviorEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'behavior_engine', value: state.value }, '[BehaviorEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'behavior_engine' }, '[BehaviorEngine] Reset');
  }

  getState(entityId: string): BehaviorEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BehaviorEngineState> {
    return this.states;
  }
}

export const behaviorEngine = new BehaviorEngine();
export default behaviorEngine;
