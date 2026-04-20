import { logger } from '../lib/logger.js';

/**
 * CONNECTION_MANAGER — Module #500
 * Connection lifecycle management
 * Kategori: JARINGAN & KONEKSI
 */
export interface ConnectionManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ConnectionManager {
  private states: Map<string, ConnectionManagerState> = new Map();

  private getOrCreate(entityId: string): ConnectionManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ConnectionManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'connection_manager', value: state.value }, '[ConnectionManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'connection_manager' }, '[ConnectionManager] Reset');
  }

  getState(entityId: string): ConnectionManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ConnectionManagerState> {
    return this.states;
  }
}

export const connectionManager = new ConnectionManager();
export default connectionManager;
