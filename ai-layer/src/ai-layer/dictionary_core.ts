import { logger } from '../lib/logger.js';

/**
 * DICTIONARY_CORE — Module #653
 * Core dictionary system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface DictionaryCoreState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DictionaryCore {
  private states: Map<string, DictionaryCoreState> = new Map();

  private getOrCreate(entityId: string): DictionaryCoreState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DictionaryCoreState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'dictionary_core', value: state.value }, '[DictionaryCore] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'dictionary_core' }, '[DictionaryCore] Reset');
  }

  getState(entityId: string): DictionaryCoreState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DictionaryCoreState> {
    return this.states;
  }
}

export const dictionaryCore = new DictionaryCore();
export default dictionaryCore;
