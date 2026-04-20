import { logger } from '../lib/logger.js';

/**
 * LUCK_SYSTEM — Module #766
 * Luck probability system
 * Kategori: PERSEPSI & REALITAS
 */
export interface LuckSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LuckSystem {
  private states: Map<string, LuckSystemState> = new Map();

  private getOrCreate(entityId: string): LuckSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LuckSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'luck_system', value: state.value }, '[LuckSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'luck_system' }, '[LuckSystem] Reset');
  }

  getState(entityId: string): LuckSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LuckSystemState> {
    return this.states;
  }
}

export const luckSystem = new LuckSystem();
export default luckSystem;
