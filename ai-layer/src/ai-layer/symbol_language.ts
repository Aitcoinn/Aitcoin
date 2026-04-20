import { logger } from '../lib/logger.js';

/**
 * SYMBOL_LANGUAGE — Module #633
 * Symbolic language system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SymbolLanguageState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SymbolLanguage {
  private states: Map<string, SymbolLanguageState> = new Map();

  private getOrCreate(entityId: string): SymbolLanguageState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SymbolLanguageState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'symbol_language', value: state.value }, '[SymbolLanguage] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'symbol_language' }, '[SymbolLanguage] Reset');
  }

  getState(entityId: string): SymbolLanguageState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SymbolLanguageState> {
    return this.states;
  }
}

export const symbolLanguage = new SymbolLanguage();
export default symbolLanguage;
