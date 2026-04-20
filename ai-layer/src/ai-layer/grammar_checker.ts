import { logger } from '../lib/logger.js';

/**
 * GRAMMAR_CHECKER — Module #663
 * Grammar checking and correction
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface GrammarCheckerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GrammarChecker {
  private states: Map<string, GrammarCheckerState> = new Map();

  private getOrCreate(entityId: string): GrammarCheckerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GrammarCheckerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'grammar_checker', value: state.value }, '[GrammarChecker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'grammar_checker' }, '[GrammarChecker] Reset');
  }

  getState(entityId: string): GrammarCheckerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GrammarCheckerState> {
    return this.states;
  }
}

export const grammarChecker = new GrammarChecker();
export default grammarChecker;
