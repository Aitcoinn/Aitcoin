import { logger } from '../lib/logger.js';

/**
 * MEDAL_SYSTEM — Module #830
 * Medal award system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface MedalSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MedalSystem {
  private states: Map<string, MedalSystemState> = new Map();

  private getOrCreate(entityId: string): MedalSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MedalSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'medal_system', value: state.value }, '[MedalSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'medal_system' }, '[MedalSystem] Reset');
  }

  getState(entityId: string): MedalSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MedalSystemState> {
    return this.states;
  }
}

export const medalSystem = new MedalSystem();
export default medalSystem;
