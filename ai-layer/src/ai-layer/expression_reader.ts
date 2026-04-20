import { logger } from '../lib/logger.js';

/**
 * EXPRESSION_READER — Module #709
 * Facial expression reading
 * Kategori: PERSEPSI & REALITAS
 */
export interface ExpressionReaderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ExpressionReader {
  private states: Map<string, ExpressionReaderState> = new Map();

  private getOrCreate(entityId: string): ExpressionReaderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ExpressionReaderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'expression_reader', value: state.value }, '[ExpressionReader] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'expression_reader' }, '[ExpressionReader] Reset');
  }

  getState(entityId: string): ExpressionReaderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ExpressionReaderState> {
    return this.states;
  }
}

export const expressionReader = new ExpressionReader();
export default expressionReader;
