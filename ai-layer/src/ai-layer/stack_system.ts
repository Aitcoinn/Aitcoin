import { logger } from '../lib/logger.js';

/**
 * STACK_SYSTEM — Module #369
 * Stack-based processing system
 * Kategori: MESIN & SISTEM
 */
export interface StackSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StackSystem {
  private states: Map<string, StackSystemState> = new Map();

  private getOrCreate(entityId: string): StackSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StackSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'stack_system', value: state.value }, '[StackSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'stack_system' }, '[StackSystem] Reset');
  }

  getState(entityId: string): StackSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StackSystemState> {
    return this.states;
  }
}

export const stackSystem = new StackSystem();
export default stackSystem;
