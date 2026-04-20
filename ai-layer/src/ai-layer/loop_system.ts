import { logger } from '../lib/logger.js';

/**
 * LOOP_SYSTEM — Module #355
 * Loop execution and management
 * Kategori: MESIN & SISTEM
 */
export interface LoopSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LoopSystem {
  private states: Map<string, LoopSystemState> = new Map();

  private getOrCreate(entityId: string): LoopSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LoopSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'loop_system', value: state.value }, '[LoopSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'loop_system' }, '[LoopSystem] Reset');
  }

  getState(entityId: string): LoopSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LoopSystemState> {
    return this.states;
  }
}

export const loopSystem = new LoopSystem();
export default loopSystem;
