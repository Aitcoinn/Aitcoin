import { logger } from '../lib/logger.js';

/**
 * STRATEGY_PATTERN — Module #387
 * Strategy selection and execution
 * Kategori: MESIN & SISTEM
 */
export interface StrategyPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StrategyPattern {
  private states: Map<string, StrategyPatternState> = new Map();

  private getOrCreate(entityId: string): StrategyPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StrategyPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'strategy_pattern', value: state.value }, '[StrategyPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'strategy_pattern' }, '[StrategyPattern] Reset');
  }

  getState(entityId: string): StrategyPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StrategyPatternState> {
    return this.states;
  }
}

export const strategyPattern = new StrategyPattern();
export default strategyPattern;
