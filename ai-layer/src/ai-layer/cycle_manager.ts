import { logger } from '../lib/logger.js';

/**
 * CYCLE_MANAGER — Module #354
 * Lifecycle and cycle management
 * Kategori: MESIN & SISTEM
 */
export interface CycleManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CycleManager {
  private states: Map<string, CycleManagerState> = new Map();

  private getOrCreate(entityId: string): CycleManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CycleManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'cycle_manager', value: state.value }, '[CycleManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'cycle_manager' }, '[CycleManager] Reset');
  }

  getState(entityId: string): CycleManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CycleManagerState> {
    return this.states;
  }
}

export const cycleManager = new CycleManager();
export default cycleManager;
