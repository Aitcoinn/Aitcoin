import { logger } from '../lib/logger.js';

/**
 * WORD_SELECTOR — Module #651
 * Word selection and suggestion
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface WordSelectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WordSelector {
  private states: Map<string, WordSelectorState> = new Map();

  private getOrCreate(entityId: string): WordSelectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WordSelectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'word_selector', value: state.value }, '[WordSelector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'word_selector' }, '[WordSelector] Reset');
  }

  getState(entityId: string): WordSelectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WordSelectorState> {
    return this.states;
  }
}

export const wordSelector = new WordSelector();
export default wordSelector;
