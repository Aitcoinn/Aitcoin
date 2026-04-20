import { logger } from '../lib/logger.js';

/**
 * SYNCHRONIZATION_CORE — Module #364
 * Multi-system synchronization
 * Kategori: MESIN & SISTEM
 */
export interface SynchronizationCoreState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SynchronizationCore {
  private states: Map<string, SynchronizationCoreState> = new Map();

  private getOrCreate(entityId: string): SynchronizationCoreState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SynchronizationCoreState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'synchronization_core', value: state.value }, '[SynchronizationCore] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'synchronization_core' }, '[SynchronizationCore] Reset');
  }

  getState(entityId: string): SynchronizationCoreState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SynchronizationCoreState> {
    return this.states;
  }
}

export const synchronizationCore = new SynchronizationCore();
export default synchronizationCore;
