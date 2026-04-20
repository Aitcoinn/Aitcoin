import { logger } from '../lib/logger.js';

/**
 * MEANING_EXTRACTOR — Module #660
 * Semantic meaning extraction
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface MeaningExtractorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MeaningExtractor {
  private states: Map<string, MeaningExtractorState> = new Map();

  private getOrCreate(entityId: string): MeaningExtractorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MeaningExtractorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'meaning_extractor', value: state.value }, '[MeaningExtractor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'meaning_extractor' }, '[MeaningExtractor] Reset');
  }

  getState(entityId: string): MeaningExtractorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MeaningExtractorState> {
    return this.states;
  }
}

export const meaningExtractor = new MeaningExtractor();
export default meaningExtractor;
