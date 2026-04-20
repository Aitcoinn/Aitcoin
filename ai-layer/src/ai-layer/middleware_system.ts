import { logger } from '../lib/logger.js';

/**
 * MIDDLEWARE_SYSTEM — Module #379
 * Middleware pipeline system
 * Kategori: MESIN & SISTEM
 */
export interface MiddlewareSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MiddlewareSystem {
  private states: Map<string, MiddlewareSystemState> = new Map();

  private getOrCreate(entityId: string): MiddlewareSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MiddlewareSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'middleware_system', value: state.value }, '[MiddlewareSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'middleware_system' }, '[MiddlewareSystem] Reset');
  }

  getState(entityId: string): MiddlewareSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MiddlewareSystemState> {
    return this.states;
  }
}

export const middlewareSystem = new MiddlewareSystem();
export default middlewareSystem;
