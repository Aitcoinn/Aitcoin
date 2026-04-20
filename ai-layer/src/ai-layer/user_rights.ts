import { logger } from '../lib/logger.js';

/**
 * USER_RIGHTS — Module #442
 * User rights and privileges
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface UserRightsState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UserRights {
  private states: Map<string, UserRightsState> = new Map();

  private getOrCreate(entityId: string): UserRightsState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UserRightsState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'user_rights', value: state.value }, '[UserRights] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'user_rights' }, '[UserRights] Reset');
  }

  getState(entityId: string): UserRightsState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UserRightsState> {
    return this.states;
  }
}

export const userRights = new UserRights();
export default userRights;
