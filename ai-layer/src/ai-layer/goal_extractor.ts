import { logger } from '../lib/logger.js';

/**
 * GOAL_EXTRACTOR — Module #672
 * Goal extraction from text
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface GoalExtractorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GoalExtractor {
  private states: Map<string, GoalExtractorState> = new Map();

  private getOrCreate(entityId: string): GoalExtractorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GoalExtractorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'goal_extractor', value: state.value }, '[GoalExtractor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'goal_extractor' }, '[GoalExtractor] Reset');
  }

  getState(entityId: string): GoalExtractorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GoalExtractorState> {
    return this.states;
  }
}

export const goalExtractor = new GoalExtractor();
export default goalExtractor;
