import { logger } from '../lib/logger.js';

/**
 * STATE_PATTERN — Module #389
 * State machine pattern implementation
 * Kategori: MESIN & SISTEM
 */
export interface StatePatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StatePattern {
  private states: Map<string, StatePatternState> = new Map();

  private getOrCreate(entityId: string): StatePatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StatePatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'state_pattern', value: state.value }, '[StatePattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'state_pattern' }, '[StatePattern] Reset');
  }

  getState(entityId: string): StatePatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StatePatternState> {
    return this.states;
  }
}

export const statePattern = new StatePattern();
export default statePattern;
