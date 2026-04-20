import { logger } from '../lib/logger.js';

/**
 * TEMPERATURE_SENSOR — Module #794
 * Temperature sensing system
 * Kategori: PERSEPSI & REALITAS
 */
export interface TemperatureSensorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TemperatureSensor {
  private states: Map<string, TemperatureSensorState> = new Map();

  private getOrCreate(entityId: string): TemperatureSensorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TemperatureSensorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'temperature_sensor', value: state.value }, '[TemperatureSensor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'temperature_sensor' }, '[TemperatureSensor] Reset');
  }

  getState(entityId: string): TemperatureSensorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TemperatureSensorState> {
    return this.states;
  }
}

export const temperatureSensor = new TemperatureSensor();
export default temperatureSensor;
