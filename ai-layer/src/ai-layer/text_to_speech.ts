import { logger } from '../lib/logger.js';

/**
 * TEXT_TO_SPEECH — Module #601
 * Text-to-speech conversion
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface TextToSpeechState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TextToSpeech {
  private states: Map<string, TextToSpeechState> = new Map();

  private getOrCreate(entityId: string): TextToSpeechState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TextToSpeechState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'text_to_speech', value: state.value }, '[TextToSpeech] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'text_to_speech' }, '[TextToSpeech] Reset');
  }

  getState(entityId: string): TextToSpeechState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TextToSpeechState> {
    return this.states;
  }
}

export const textToSpeech = new TextToSpeech();
export default textToSpeech;
