import { logger } from '../lib/logger.js';

/**
 * BLESSING_GIVER — Module #921
 * Blessing distribution system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface BlessingGiverState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BlessingGiver {
  private states: Map<string, BlessingGiverState> = new Map();

  private getOrCreate(entityId: string): BlessingGiverState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BlessingGiverState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'blessing_giver', value: state.value }, '[BlessingGiver] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'blessing_giver' }, '[BlessingGiver] Reset');
  }

  getState(entityId: string): BlessingGiverState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BlessingGiverState> {
    return this.states;
  }
}

export const blessingGiver = new BlessingGiver();
export default blessingGiver;
