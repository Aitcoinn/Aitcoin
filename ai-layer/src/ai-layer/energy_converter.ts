import { logger } from '../lib/logger.js';

/**
 * ENERGY_CONVERTER — Module #791
 * Energy conversion system
 * Kategori: PERSEPSI & REALITAS
 */
export interface EnergyConverterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EnergyConverter {
  private states: Map<string, EnergyConverterState> = new Map();

  private getOrCreate(entityId: string): EnergyConverterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EnergyConverterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'energy_converter', value: state.value }, '[EnergyConverter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'energy_converter' }, '[EnergyConverter] Reset');
  }

  getState(entityId: string): EnergyConverterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EnergyConverterState> {
    return this.states;
  }
}

export const energyConverter = new EnergyConverter();
export default energyConverter;
