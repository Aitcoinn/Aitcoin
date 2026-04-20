import { logger } from '../lib/logger.js';

/**
 * BALANCE_CALCULATOR — Module #361
 * Balance computation and restoration
 * Kategori: MESIN & SISTEM
 */
export interface BalanceCalculatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BalanceCalculator {
  private states: Map<string, BalanceCalculatorState> = new Map();

  private getOrCreate(entityId: string): BalanceCalculatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BalanceCalculatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'balance_calculator', value: state.value }, '[BalanceCalculator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'balance_calculator' }, '[BalanceCalculator] Reset');
  }

  getState(entityId: string): BalanceCalculatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BalanceCalculatorState> {
    return this.states;
  }
}

export const balanceCalculator = new BalanceCalculator();
export default balanceCalculator;
