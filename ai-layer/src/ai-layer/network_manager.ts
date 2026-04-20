import { logger } from '../lib/logger.js';

/**
 * NETWORK_MANAGER — Module #374
 * Network interface management
 * Kategori: MESIN & SISTEM
 */
export interface NetworkManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NetworkManager {
  private states: Map<string, NetworkManagerState> = new Map();

  private getOrCreate(entityId: string): NetworkManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NetworkManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'network_manager', value: state.value }, '[NetworkManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'network_manager' }, '[NetworkManager] Reset');
  }

  getState(entityId: string): NetworkManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NetworkManagerState> {
    return this.states;
  }
}

export const networkManager = new NetworkManager();
export default networkManager;
