import { logger } from '../lib/logger.js';

/**
 * RULER_ENGINE — Module #833
 * Ruler authority engine
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface RulerEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RulerEngine {
  private states: Map<string, RulerEngineState> = new Map();

  private getOrCreate(entityId: string): RulerEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RulerEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ruler_engine', value: state.value }, '[RulerEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ruler_engine' }, '[RulerEngine] Reset');
  }

  getState(entityId: string): RulerEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RulerEngineState> {
    return this.states;
  }
}

export const rulerEngine = new RulerEngine();
export default rulerEngine;
