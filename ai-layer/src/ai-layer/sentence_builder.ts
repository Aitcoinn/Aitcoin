import { logger } from '../lib/logger.js';

/**
 * SENTENCE_BUILDER — Module #650
 * Sentence construction engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SentenceBuilderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SentenceBuilder {
  private states: Map<string, SentenceBuilderState> = new Map();

  private getOrCreate(entityId: string): SentenceBuilderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SentenceBuilderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sentence_builder', value: state.value }, '[SentenceBuilder] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sentence_builder' }, '[SentenceBuilder] Reset');
  }

  getState(entityId: string): SentenceBuilderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SentenceBuilderState> {
    return this.states;
  }
}

export const sentenceBuilder = new SentenceBuilder();
export default sentenceBuilder;
