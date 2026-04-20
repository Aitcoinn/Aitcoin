import { logger } from '../lib/logger.js';

/**
 * ENERGY_SOURCE — Module #897
 * Energy source management
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface EnergySourceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EnergySource {
  private states: Map<string, EnergySourceState> = new Map();

  private getOrCreate(entityId: string): EnergySourceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EnergySourceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'energy_source', value: state.value }, '[EnergySource] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'energy_source' }, '[EnergySource] Reset');
  }

  getState(entityId: string): EnergySourceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EnergySourceState> {
    return this.states;
  }
}

export const energySource = new EnergySource();
export default energySource;
