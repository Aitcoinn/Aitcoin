import { logger } from '../lib/logger.js';

/**
 * PERSONALITY_IN_SPEECH — Module #609
 * Personality expression in speech
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface PersonalityInSpeechState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PersonalityInSpeech {
  private states: Map<string, PersonalityInSpeechState> = new Map();

  private getOrCreate(entityId: string): PersonalityInSpeechState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PersonalityInSpeechState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'personality_in_speech', value: state.value }, '[PersonalityInSpeech] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'personality_in_speech' }, '[PersonalityInSpeech] Reset');
  }

  getState(entityId: string): PersonalityInSpeechState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PersonalityInSpeechState> {
    return this.states;
  }
}

export const personalityInSpeech = new PersonalityInSpeech();
export default personalityInSpeech;
