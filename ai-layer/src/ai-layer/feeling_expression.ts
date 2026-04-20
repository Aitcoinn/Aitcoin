import { logger } from '../lib/logger.js';

/**
 * FEELING_EXPRESSION — Module #632
 * Feeling expression system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface FeelingExpressionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FeelingExpression {
  private states: Map<string, FeelingExpressionState> = new Map();

  private getOrCreate(entityId: string): FeelingExpressionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FeelingExpressionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'feeling_expression', value: state.value }, '[FeelingExpression] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'feeling_expression' }, '[FeelingExpression] Reset');
  }

  getState(entityId: string): FeelingExpressionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FeelingExpressionState> {
    return this.states;
  }
}

export const feelingExpression = new FeelingExpression();
export default feelingExpression;
