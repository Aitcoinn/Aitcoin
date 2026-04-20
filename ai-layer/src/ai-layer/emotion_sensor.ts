import { logger } from '../lib/logger.js';

/**
 * EMOTION_SENSOR — Module #753
 * Emotion sensing system
 * Kategori: PERSEPSI & REALITAS
 */
export interface EmotionSensorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EmotionSensor {
  private states: Map<string, EmotionSensorState> = new Map();

  private getOrCreate(entityId: string): EmotionSensorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EmotionSensorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'emotion_sensor', value: state.value }, '[EmotionSensor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'emotion_sensor' }, '[EmotionSensor] Reset');
  }

  getState(entityId: string): EmotionSensorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EmotionSensorState> {
    return this.states;
  }
}

export const emotionSensor = new EmotionSensor();
export default emotionSensor;
