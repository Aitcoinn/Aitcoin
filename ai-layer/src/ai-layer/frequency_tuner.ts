import { logger } from '../lib/logger.js';

/**
 * FREQUENCY_TUNER — Module #757
 * Frequency tuning system
 * Kategori: PERSEPSI & REALITAS
 */
export interface FrequencyTunerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FrequencyTuner {
  private states: Map<string, FrequencyTunerState> = new Map();

  private getOrCreate(entityId: string): FrequencyTunerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FrequencyTunerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'frequency_tuner', value: state.value }, '[FrequencyTuner] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'frequency_tuner' }, '[FrequencyTuner] Reset');
  }

  getState(entityId: string): FrequencyTunerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FrequencyTunerState> {
    return this.states;
  }
}

export const frequencyTuner = new FrequencyTuner();
export default frequencyTuner;
