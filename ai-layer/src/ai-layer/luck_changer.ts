import { logger } from '../lib/logger.js';

/**
 * LUCK_CHANGER — Module #943
 * Luck alteration system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface LuckChangerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LuckChanger {
  private states: Map<string, LuckChangerState> = new Map();

  private getOrCreate(entityId: string): LuckChangerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LuckChangerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'luck_changer', value: state.value }, '[LuckChanger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'luck_changer' }, '[LuckChanger] Reset');
  }

  getState(entityId: string): LuckChangerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LuckChangerState> {
    return this.states;
  }
}

export const luckChanger = new LuckChanger();
export default luckChanger;
