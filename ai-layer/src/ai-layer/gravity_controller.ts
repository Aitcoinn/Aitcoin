import { logger } from '../lib/logger.js';

/**
 * GRAVITY_CONTROLLER — Module #733
 * Gravity simulation and control
 * Kategori: PERSEPSI & REALITAS
 */
export interface GravityControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GravityController {
  private states: Map<string, GravityControllerState> = new Map();

  private getOrCreate(entityId: string): GravityControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GravityControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'gravity_controller', value: state.value }, '[GravityController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'gravity_controller' }, '[GravityController] Reset');
  }

  getState(entityId: string): GravityControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GravityControllerState> {
    return this.states;
  }
}

export const gravityController = new GravityController();
export default gravityController;
