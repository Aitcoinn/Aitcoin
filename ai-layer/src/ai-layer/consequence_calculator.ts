import { logger } from '../lib/logger.js';

/**
 * CONSEQUENCE_CALCULATOR — Module #774
 * Action consequence calculator
 * Kategori: PERSEPSI & REALITAS
 */
export interface ConsequenceCalculatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ConsequenceCalculator {
  private states: Map<string, ConsequenceCalculatorState> = new Map();

  private getOrCreate(entityId: string): ConsequenceCalculatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ConsequenceCalculatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'consequence_calculator', value: state.value }, '[ConsequenceCalculator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'consequence_calculator' }, '[ConsequenceCalculator] Reset');
  }

  getState(entityId: string): ConsequenceCalculatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ConsequenceCalculatorState> {
    return this.states;
  }
}

export const consequenceCalculator = new ConsequenceCalculator();
export default consequenceCalculator;
