import { logger } from '../lib/logger.js';

/**
 * BROADCAST_SYSTEM — Module #529
 * Network broadcast system
 * Kategori: JARINGAN & KONEKSI
 */
export interface BroadcastSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BroadcastSystem {
  private states: Map<string, BroadcastSystemState> = new Map();

  private getOrCreate(entityId: string): BroadcastSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BroadcastSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'broadcast_system', value: state.value }, '[BroadcastSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'broadcast_system' }, '[BroadcastSystem] Reset');
  }

  getState(entityId: string): BroadcastSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BroadcastSystemState> {
    return this.states;
  }
}

export const broadcastSystem = new BroadcastSystem();
export default broadcastSystem;
