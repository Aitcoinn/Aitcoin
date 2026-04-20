import { logger } from '../lib/logger.js';

/**
 * BANDWIDTH_MANAGER — Module #523
 * Bandwidth allocation and management
 * Kategori: JARINGAN & KONEKSI
 */
export interface BandwidthManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BandwidthManager {
  private states: Map<string, BandwidthManagerState> = new Map();

  private getOrCreate(entityId: string): BandwidthManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BandwidthManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'bandwidth_manager', value: state.value }, '[BandwidthManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'bandwidth_manager' }, '[BandwidthManager] Reset');
  }

  getState(entityId: string): BandwidthManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BandwidthManagerState> {
    return this.states;
  }
}

export const bandwidthManager = new BandwidthManager();
export default bandwidthManager;
