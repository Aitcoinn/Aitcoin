import { logger } from '../lib/logger.js';

/**
 * ITERATOR_PATTERN — Module #391
 * Iterator pattern for collection traversal
 * Kategori: MESIN & SISTEM
 */
export interface IteratorPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IteratorPattern {
  private states: Map<string, IteratorPatternState> = new Map();

  private getOrCreate(entityId: string): IteratorPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IteratorPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'iterator_pattern', value: state.value }, '[IteratorPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'iterator_pattern' }, '[IteratorPattern] Reset');
  }

  getState(entityId: string): IteratorPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IteratorPatternState> {
    return this.states;
  }
}

export const iteratorPattern = new IteratorPattern();
export default iteratorPattern;
