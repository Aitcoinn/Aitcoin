import { logger } from '../lib/logger.js';

/**
 * DENSITY_CONTROLLER — Module #793
 * Density control system
 * Kategori: PERSEPSI & REALITAS
 */
export interface DensityControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DensityController {
  private states: Map<string, DensityControllerState> = new Map();

  private getOrCreate(entityId: string): DensityControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DensityControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'density_controller', value: state.value }, '[DensityController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'density_controller' }, '[DensityController] Reset');
  }

  getState(entityId: string): DensityControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DensityControllerState> {
    return this.states;
  }
}

export const densityController = new DensityController();
export default densityController;
