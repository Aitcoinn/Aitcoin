import { logger } from '../lib/logger.js';

/**
 * COMPLEXITY_HANDLER — Module #342
 * Complexity analysis and management
 * Kategori: MESIN & SISTEM
 */
export interface ComplexityHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ComplexityHandler {
  private states: Map<string, ComplexityHandlerState> = new Map();

  private getOrCreate(entityId: string): ComplexityHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ComplexityHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'complexity_handler', value: state.value }, '[ComplexityHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'complexity_handler' }, '[ComplexityHandler] Reset');
  }

  getState(entityId: string): ComplexityHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ComplexityHandlerState> {
    return this.states;
  }
}

export const complexityHandler = new ComplexityHandler();
export default complexityHandler;
