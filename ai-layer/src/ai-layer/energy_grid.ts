import { logger } from '../lib/logger.js';

/**
 * ENERGY_GRID — Module #587
 * Energy distribution grid
 * Kategori: JARINGAN & KONEKSI
 */
export interface EnergyGridState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EnergyGrid {
  private states: Map<string, EnergyGridState> = new Map();

  private getOrCreate(entityId: string): EnergyGridState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EnergyGridState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'energy_grid', value: state.value }, '[EnergyGrid] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'energy_grid' }, '[EnergyGrid] Reset');
  }

  getState(entityId: string): EnergyGridState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EnergyGridState> {
    return this.states;
  }
}

export const energyGrid = new EnergyGrid();
export default energyGrid;
