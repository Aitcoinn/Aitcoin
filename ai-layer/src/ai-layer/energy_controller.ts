import { logger } from '../lib/logger.js';

/**
 * ENERGY_CONTROLLER — Module #349
 * Energy flow control and distribution
 * Kategori: MESIN & SISTEM
 */
export interface EnergyControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EnergyController {
  private states: Map<string, EnergyControllerState> = new Map();

  private getOrCreate(entityId: string): EnergyControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EnergyControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'energy_controller', value: state.value }, '[EnergyController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'energy_controller' }, '[EnergyController] Reset');
  }

  getState(entityId: string): EnergyControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EnergyControllerState> {
    return this.states;
  }
}

export const energyController = new EnergyController();
export default energyController;
