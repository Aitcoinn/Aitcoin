import { logger } from '../lib/logger.js';

/**
 * ENERGY_READER — Module #755
 * Energy field reading
 * Kategori: PERSEPSI & REALITAS
 */
export interface EnergyReaderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EnergyReader {
  private states: Map<string, EnergyReaderState> = new Map();

  private getOrCreate(entityId: string): EnergyReaderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EnergyReaderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'energy_reader', value: state.value }, '[EnergyReader] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'energy_reader' }, '[EnergyReader] Reset');
  }

  getState(entityId: string): EnergyReaderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EnergyReaderState> {
    return this.states;
  }
}

export const energyReader = new EnergyReader();
export default energyReader;
