import { logger } from '../lib/logger.js';

/**
 * NIGHTMARE_SYSTEM — Module #747
 * Nightmare scenario simulation
 * Kategori: PERSEPSI & REALITAS
 */
export interface NightmareSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NightmareSystem {
  private states: Map<string, NightmareSystemState> = new Map();

  private getOrCreate(entityId: string): NightmareSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NightmareSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'nightmare_system', value: state.value }, '[NightmareSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'nightmare_system' }, '[NightmareSystem] Reset');
  }

  getState(entityId: string): NightmareSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NightmareSystemState> {
    return this.states;
  }
}

export const nightmareSystem = new NightmareSystem();
export default nightmareSystem;
