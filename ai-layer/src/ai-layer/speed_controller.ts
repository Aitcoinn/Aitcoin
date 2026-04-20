import { logger } from '../lib/logger.js';

/**
 * SPEED_CONTROLLER — Module #347
 * Processing speed control and throttling
 * Kategori: MESIN & SISTEM
 */
export interface SpeedControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpeedController {
  private states: Map<string, SpeedControllerState> = new Map();

  private getOrCreate(entityId: string): SpeedControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpeedControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'speed_controller', value: state.value }, '[SpeedController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'speed_controller' }, '[SpeedController] Reset');
  }

  getState(entityId: string): SpeedControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpeedControllerState> {
    return this.states;
  }
}

export const speedController = new SpeedController();
export default speedController;
