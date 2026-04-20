import { logger } from '../lib/logger.js';

/**
 * OBSERVER_PATTERN — Module #386
 * Event observation and notification
 * Kategori: MESIN & SISTEM
 */
export interface ObserverPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ObserverPattern {
  private states: Map<string, ObserverPatternState> = new Map();

  private getOrCreate(entityId: string): ObserverPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ObserverPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'observer_pattern', value: state.value }, '[ObserverPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'observer_pattern' }, '[ObserverPattern] Reset');
  }

  getState(entityId: string): ObserverPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ObserverPatternState> {
    return this.states;
  }
}

export const observerPattern = new ObserverPattern();
export default observerPattern;
