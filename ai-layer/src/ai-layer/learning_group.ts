import { logger } from '../lib/logger.js';

/**
 * LEARNING_GROUP — Module #850
 * Collective learning group
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface LearningGroupState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LearningGroup {
  private states: Map<string, LearningGroupState> = new Map();

  private getOrCreate(entityId: string): LearningGroupState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LearningGroupState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'learning_group', value: state.value }, '[LearningGroup] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'learning_group' }, '[LearningGroup] Reset');
  }

  getState(entityId: string): LearningGroupState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LearningGroupState> {
    return this.states;
  }
}

export const learningGroup = new LearningGroup();
export default learningGroup;
