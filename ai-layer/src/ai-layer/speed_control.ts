import { logger } from '../lib/logger.js';

/**
 * SPEED_CONTROL — Module #735
 * Simulation speed control
 * Kategori: PERSEPSI & REALITAS
 */
export interface SpeedControlState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpeedControl {
  private states: Map<string, SpeedControlState> = new Map();

  private getOrCreate(entityId: string): SpeedControlState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpeedControlState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'speed_control', value: state.value }, '[SpeedControl] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'speed_control' }, '[SpeedControl] Reset');
  }

  getState(entityId: string): SpeedControlState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpeedControlState> {
    return this.states;
  }
}

export const speedControl = new SpeedControl();
export default speedControl;
