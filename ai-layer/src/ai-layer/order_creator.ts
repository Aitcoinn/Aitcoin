import { logger } from '../lib/logger.js';

/**
 * ORDER_CREATOR — Module #762
 * Order creation from chaos
 * Kategori: PERSEPSI & REALITAS
 */
export interface OrderCreatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OrderCreator {
  private states: Map<string, OrderCreatorState> = new Map();

  private getOrCreate(entityId: string): OrderCreatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OrderCreatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'order_creator', value: state.value }, '[OrderCreator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'order_creator' }, '[OrderCreator] Reset');
  }

  getState(entityId: string): OrderCreatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OrderCreatorState> {
    return this.states;
  }
}

export const orderCreator = new OrderCreator();
export default orderCreator;
