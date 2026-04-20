import { logger } from '../lib/logger.js';

/**
 * PATTERN_MAKER — Module #357
 * Pattern creation and recognition
 * Kategori: MESIN & SISTEM
 */
export interface PatternMakerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PatternMaker {
  private states: Map<string, PatternMakerState> = new Map();

  private getOrCreate(entityId: string): PatternMakerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PatternMakerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'pattern_maker', value: state.value }, '[PatternMaker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'pattern_maker' }, '[PatternMaker] Reset');
  }

  getState(entityId: string): PatternMakerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PatternMakerState> {
    return this.states;
  }
}

export const patternMaker = new PatternMaker();
export default patternMaker;
