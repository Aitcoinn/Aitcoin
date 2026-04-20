import { logger } from '../lib/logger.js';

/**
 * MULTI_LANGUAGE — Module #625
 * Multi-language support system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface MultiLanguageState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MultiLanguage {
  private states: Map<string, MultiLanguageState> = new Map();

  private getOrCreate(entityId: string): MultiLanguageState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MultiLanguageState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'multi_language', value: state.value }, '[MultiLanguage] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'multi_language' }, '[MultiLanguage] Reset');
  }

  getState(entityId: string): MultiLanguageState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MultiLanguageState> {
    return this.states;
  }
}

export const multiLanguage = new MultiLanguage();
export default multiLanguage;
