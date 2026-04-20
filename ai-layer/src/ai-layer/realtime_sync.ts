import { logger } from '../lib/logger.js';

/**
 * REALTIME_SYNC — Module #544
 * Real-time synchronization engine
 * Kategori: JARINGAN & KONEKSI
 */
export interface RealtimeSyncState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RealtimeSync {
  private states: Map<string, RealtimeSyncState> = new Map();

  private getOrCreate(entityId: string): RealtimeSyncState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RealtimeSyncState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'realtime_sync', value: state.value }, '[RealtimeSync] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'realtime_sync' }, '[RealtimeSync] Reset');
  }

  getState(entityId: string): RealtimeSyncState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RealtimeSyncState> {
    return this.states;
  }
}

export const realtimeSync = new RealtimeSync();
export default realtimeSync;
