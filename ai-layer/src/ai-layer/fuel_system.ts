import { logger } from '../lib/logger.js';

/**
 * FUEL_SYSTEM — Module #898
 * Fuel management system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface FuelSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FuelSystem {
  private states: Map<string, FuelSystemState> = new Map();

  private getOrCreate(entityId: string): FuelSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FuelSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'fuel_system', value: state.value }, '[FuelSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'fuel_system' }, '[FuelSystem] Reset');
  }

  getState(entityId: string): FuelSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FuelSystemState> {
    return this.states;
  }
}

export const fuelSystem = new FuelSystem();
export default fuelSystem;
