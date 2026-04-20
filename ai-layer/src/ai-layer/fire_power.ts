import { logger } from '../lib/logger.js';

/**
 * FIRE_POWER — Module #903
 * Thermal energy system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface FirePowerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FirePower {
  private states: Map<string, FirePowerState> = new Map();

  private getOrCreate(entityId: string): FirePowerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FirePowerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'fire_power', value: state.value }, '[FirePower] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'fire_power' }, '[FirePower] Reset');
  }

  getState(entityId: string): FirePowerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FirePowerState> {
    return this.states;
  }
}

export const firePower = new FirePower();
export default firePower;
