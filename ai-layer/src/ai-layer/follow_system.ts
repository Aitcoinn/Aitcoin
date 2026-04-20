import { logger } from '../lib/logger.js';

/**
 * FOLLOW_SYSTEM — Module #582
 * Follow/subscriber system
 * Kategori: JARINGAN & KONEKSI
 */
export interface FollowSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FollowSystem {
  private states: Map<string, FollowSystemState> = new Map();

  private getOrCreate(entityId: string): FollowSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FollowSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'follow_system', value: state.value }, '[FollowSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'follow_system' }, '[FollowSystem] Reset');
  }

  getState(entityId: string): FollowSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FollowSystemState> {
    return this.states;
  }
}

export const followSystem = new FollowSystem();
export default followSystem;
