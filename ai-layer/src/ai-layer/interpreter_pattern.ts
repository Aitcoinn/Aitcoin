import { logger } from '../lib/logger.js';

/**
 * INTERPRETER_PATTERN — Module #397
 * Language and grammar interpreter
 * Kategori: MESIN & SISTEM
 */
export interface InterpreterPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InterpreterPattern {
  private states: Map<string, InterpreterPatternState> = new Map();

  private getOrCreate(entityId: string): InterpreterPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InterpreterPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'interpreter_pattern', value: state.value }, '[InterpreterPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'interpreter_pattern' }, '[InterpreterPattern] Reset');
  }

  getState(entityId: string): InterpreterPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InterpreterPatternState> {
    return this.states;
  }
}

export const interpreterPattern = new InterpreterPattern();
export default interpreterPattern;
