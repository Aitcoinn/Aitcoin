import { logger } from '../lib/logger.js';

/**
 * EARTH_ENERGY — Module #904
 * Geothermal energy system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface EarthEnergyState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EarthEnergy {
  private states: Map<string, EarthEnergyState> = new Map();

  private getOrCreate(entityId: string): EarthEnergyState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EarthEnergyState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'earth_energy', value: state.value }, '[EarthEnergy] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'earth_energy' }, '[EarthEnergy] Reset');
  }

  getState(entityId: string): EarthEnergyState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EarthEnergyState> {
    return this.states;
  }
}

export const earthEnergy = new EarthEnergy();
export default earthEnergy;
