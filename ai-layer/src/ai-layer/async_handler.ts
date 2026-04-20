import { logger } from '../lib/logger.js';

/**
 * ASYNC_HANDLER — Module #365
 * Asynchronous operation handling
 * Kategori: MESIN & SISTEM
 */
export interface AsyncHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AsyncHandler {
  private states: Map<string, AsyncHandlerState> = new Map();

  private getOrCreate(entityId: string): AsyncHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AsyncHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'async_handler', value: state.value }, '[AsyncHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'async_handler' }, '[AsyncHandler] Reset');
  }

  getState(entityId: string): AsyncHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AsyncHandlerState> {
    return this.states;
  }
}

export const asyncHandler = new AsyncHandler();
export default asyncHandler;
