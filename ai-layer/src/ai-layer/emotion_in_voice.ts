import { logger } from '../lib/logger.js';

/**
 * EMOTION_IN_VOICE — Module #608
 * Emotional expression in speech
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface EmotionInVoiceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EmotionInVoice {
  private states: Map<string, EmotionInVoiceState> = new Map();

  private getOrCreate(entityId: string): EmotionInVoiceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EmotionInVoiceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'emotion_in_voice', value: state.value }, '[EmotionInVoice] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'emotion_in_voice' }, '[EmotionInVoice] Reset');
  }

  getState(entityId: string): EmotionInVoiceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EmotionInVoiceState> {
    return this.states;
  }
}

export const emotionInVoice = new EmotionInVoice();
export default emotionInVoice;
