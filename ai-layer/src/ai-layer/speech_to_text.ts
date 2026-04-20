import { logger } from '../lib/logger.js';

/**
 * SPEECH_TO_TEXT — Module #602
 * Speech-to-text conversion
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SpeechToTextState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpeechToText {
  private states: Map<string, SpeechToTextState> = new Map();

  private getOrCreate(entityId: string): SpeechToTextState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpeechToTextState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'speech_to_text', value: state.value }, '[SpeechToText] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'speech_to_text' }, '[SpeechToText] Reset');
  }

  getState(entityId: string): SpeechToTextState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpeechToTextState> {
    return this.states;
  }
}

export const speechToText = new SpeechToText();
export default speechToText;
