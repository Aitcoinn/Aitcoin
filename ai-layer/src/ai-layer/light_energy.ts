import { logger } from '../lib/logger.js';

/**
 * LIGHT_ENERGY — Module #906
 * Photon energy system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface LightEnergyState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LightEnergy {
  private states: Map<string, LightEnergyState> = new Map();

  private getOrCreate(entityId: string): LightEnergyState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LightEnergyState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'light_energy', value: state.value }, '[LightEnergy] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'light_energy' }, '[LightEnergy] Reset');
  }

  getState(entityId: string): LightEnergyState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LightEnergyState> {
    return this.states;
  }
}

export const lightEnergy = new LightEnergy();
export default lightEnergy;
