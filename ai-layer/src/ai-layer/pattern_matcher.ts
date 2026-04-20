import { logger } from '../lib/logger.js';

/**
 * PATTERN_MATCHER — Module #720
 * Pattern matching system
 * Kategori: PERSEPSI & REALITAS
 */
export interface PatternMatcherState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PatternMatcher {
  private states: Map<string, PatternMatcherState> = new Map();

  private getOrCreate(entityId: string): PatternMatcherState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PatternMatcherState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'pattern_matcher', value: state.value }, '[PatternMatcher] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'pattern_matcher' }, '[PatternMatcher] Reset');
  }

  getState(entityId: string): PatternMatcherState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PatternMatcherState> {
    return this.states;
  }
}

export const patternMatcher = new PatternMatcher();
export default patternMatcher;
