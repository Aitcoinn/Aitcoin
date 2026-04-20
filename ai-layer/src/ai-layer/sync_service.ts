import { logger } from '../lib/logger.js';

/**
 * SYNC_SERVICE — Module #542
 * Data synchronization service
 * Kategori: JARINGAN & KONEKSI
 */
export interface SyncServiceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SyncService {
  private states: Map<string, SyncServiceState> = new Map();

  private getOrCreate(entityId: string): SyncServiceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SyncServiceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sync_service', value: state.value }, '[SyncService] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sync_service' }, '[SyncService] Reset');
  }

  getState(entityId: string): SyncServiceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SyncServiceState> {
    return this.states;
  }
}

export const syncService = new SyncService();
export default syncService;
