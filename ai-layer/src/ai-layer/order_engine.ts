import { logger } from '../lib/logger.js';

/**
 * ORDER_ENGINE — Module #337
 * Order maintenance and enforcement engine
 * Kategori: MESIN & SISTEM
 */
export interface OrderEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OrderEngine {
  private states: Map<string, OrderEngineState> = new Map();

  private getOrCreate(entityId: string): OrderEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OrderEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'order_engine', value: state.value }, '[OrderEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'order_engine' }, '[OrderEngine] Reset');
  }

  getState(entityId: string): OrderEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OrderEngineState> {
    return this.states;
  }
}

export const orderEngine = new OrderEngine();
export default orderEngine;
