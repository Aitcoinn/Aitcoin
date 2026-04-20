import { logger } from '../lib/logger.js';

/**
 * MEMENTO_PATTERN — Module #393
 * State snapshot and restoration
 * Kategori: MESIN & SISTEM
 */
export interface MementoPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MementoPattern {
  private states: Map<string, MementoPatternState> = new Map();

  private getOrCreate(entityId: string): MementoPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MementoPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'memento_pattern', value: state.value }, '[MementoPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'memento_pattern' }, '[MementoPattern] Reset');
  }

  getState(entityId: string): MementoPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MementoPatternState> {
    return this.states;
  }
}

export const mementoPattern = new MementoPattern();
export default mementoPattern;
