import { logger } from '../lib/logger.js';

/**
 * FRIEND_SYSTEM — Module #581
 * Friend network management
 * Kategori: JARINGAN & KONEKSI
 */
export interface FriendSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FriendSystem {
  private states: Map<string, FriendSystemState> = new Map();

  private getOrCreate(entityId: string): FriendSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FriendSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'friend_system', value: state.value }, '[FriendSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'friend_system' }, '[FriendSystem] Reset');
  }

  getState(entityId: string): FriendSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FriendSystemState> {
    return this.states;
  }
}

export const friendSystem = new FriendSystem();
export default friendSystem;
