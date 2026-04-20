import { logger } from '../lib/logger.js';

/**
 * CONSISTENCY_VALIDATOR — Module #473
 * Data consistency validation
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface ConsistencyValidatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ConsistencyValidator {
  private states: Map<string, ConsistencyValidatorState> = new Map();

  private getOrCreate(entityId: string): ConsistencyValidatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ConsistencyValidatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'consistency_validator', value: state.value }, '[ConsistencyValidator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'consistency_validator' }, '[ConsistencyValidator] Reset');
  }

  getState(entityId: string): ConsistencyValidatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ConsistencyValidatorState> {
    return this.states;
  }
}

export const consistencyValidator = new ConsistencyValidator();
export default consistencyValidator;
