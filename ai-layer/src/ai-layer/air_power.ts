import { logger } from '../lib/logger.js';

/**
 * AIR_POWER — Module #905
 * Pneumatic energy system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface AirPowerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AirPower {
  private states: Map<string, AirPowerState> = new Map();

  private getOrCreate(entityId: string): AirPowerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AirPowerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'air_power', value: state.value }, '[AirPower] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'air_power' }, '[AirPower] Reset');
  }

  getState(entityId: string): AirPowerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AirPowerState> {
    return this.states;
  }
}

export const airPower = new AirPower();
export default airPower;
