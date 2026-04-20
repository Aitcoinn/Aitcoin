import { logger } from '../lib/logger.js';

/**
 * RHYTHM_SPEECH — Module #607
 * Speech rhythm management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface RhythmSpeechState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RhythmSpeech {
  private states: Map<string, RhythmSpeechState> = new Map();

  private getOrCreate(entityId: string): RhythmSpeechState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RhythmSpeechState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rhythm_speech', value: state.value }, '[RhythmSpeech] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rhythm_speech' }, '[RhythmSpeech] Reset');
  }

  getState(entityId: string): RhythmSpeechState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RhythmSpeechState> {
    return this.states;
  }
}

export const rhythmSpeech = new RhythmSpeech();
export default rhythmSpeech;
