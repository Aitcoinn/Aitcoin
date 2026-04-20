import { logger } from '../lib/logger.js';

/**
 * KEY_MASTER — Module #950
 * Key management system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface KeyMasterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class KeyMaster {
  private states: Map<string, KeyMasterState> = new Map();

  private getOrCreate(entityId: string): KeyMasterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): KeyMasterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'key_master', value: state.value }, '[KeyMaster] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'key_master' }, '[KeyMaster] Reset');
  }

  getState(entityId: string): KeyMasterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, KeyMasterState> {
    return this.states;
  }
}

export const keyMaster = new KeyMaster();
export default keyMaster;
