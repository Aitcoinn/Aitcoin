import { logger } from '../lib/logger.js';

/**
 * MOOD_DETECTOR — Module #670
 * Mood detection from text
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface MoodDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MoodDetector {
  private states: Map<string, MoodDetectorState> = new Map();

  private getOrCreate(entityId: string): MoodDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MoodDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mood_detector', value: state.value }, '[MoodDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'mood_detector' }, '[MoodDetector] Reset');
  }

  getState(entityId: string): MoodDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MoodDetectorState> {
    return this.states;
  }
}

export const moodDetector = new MoodDetector();
export default moodDetector;
