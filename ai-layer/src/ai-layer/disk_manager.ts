import { logger } from '../lib/logger.js';

/**
 * DISK_MANAGER — Module #373
 * Persistent storage management
 * Kategori: MESIN & SISTEM
 */
export interface DiskManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DiskManager {
  private states: Map<string, DiskManagerState> = new Map();

  private getOrCreate(entityId: string): DiskManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DiskManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'disk_manager', value: state.value }, '[DiskManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'disk_manager' }, '[DiskManager] Reset');
  }

  getState(entityId: string): DiskManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DiskManagerState> {
    return this.states;
  }
}

export const diskManager = new DiskManager();
export default diskManager;
