import { logger } from '../lib/logger.js';

/**
 * THESAURUS_ENGINE — Module #654
 * Thesaurus and word relations
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ThesaurusEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ThesaurusEngine {
  private states: Map<string, ThesaurusEngineState> = new Map();

  private getOrCreate(entityId: string): ThesaurusEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ThesaurusEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'thesaurus_engine', value: state.value }, '[ThesaurusEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'thesaurus_engine' }, '[ThesaurusEngine] Reset');
  }

  getState(entityId: string): ThesaurusEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ThesaurusEngineState> {
    return this.states;
  }
}

export const thesaurusEngine = new ThesaurusEngine();
export default thesaurusEngine;
