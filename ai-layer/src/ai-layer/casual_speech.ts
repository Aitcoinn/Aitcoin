import { logger } from '../lib/logger.js';

/**
 * CASUAL_SPEECH — Module #612
 * Casual conversational speech
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface CasualSpeechState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CasualSpeech {
  private states: Map<string, CasualSpeechState> = new Map();

  private getOrCreate(entityId: string): CasualSpeechState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CasualSpeechState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'casual_speech', value: state.value }, '[CasualSpeech] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'casual_speech' }, '[CasualSpeech] Reset');
  }

  getState(entityId: string): CasualSpeechState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CasualSpeechState> {
    return this.states;
  }
}

export const casualSpeech = new CasualSpeech();
export default casualSpeech;
