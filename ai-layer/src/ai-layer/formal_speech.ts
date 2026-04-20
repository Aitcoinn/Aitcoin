import { logger } from '../lib/logger.js';

/**
 * FORMAL_SPEECH — Module #611
 * Formal speech generation
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface FormalSpeechState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FormalSpeech {
  private states: Map<string, FormalSpeechState> = new Map();

  private getOrCreate(entityId: string): FormalSpeechState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FormalSpeechState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'formal_speech', value: state.value }, '[FormalSpeech] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'formal_speech' }, '[FormalSpeech] Reset');
  }

  getState(entityId: string): FormalSpeechState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FormalSpeechState> {
    return this.states;
  }
}

export const formalSpeech = new FormalSpeech();
export default formalSpeech;
