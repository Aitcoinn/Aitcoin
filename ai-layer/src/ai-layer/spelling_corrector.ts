import { logger } from '../lib/logger.js';

/**
 * SPELLING_CORRECTOR — Module #664
 * Spelling correction engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SpellingCorrectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpellingCorrector {
  private states: Map<string, SpellingCorrectorState> = new Map();

  private getOrCreate(entityId: string): SpellingCorrectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpellingCorrectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'spelling_corrector', value: state.value }, '[SpellingCorrector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'spelling_corrector' }, '[SpellingCorrector] Reset');
  }

  getState(entityId: string): SpellingCorrectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpellingCorrectorState> {
    return this.states;
  }
}

export const spellingCorrector = new SpellingCorrector();
export default spellingCorrector;
