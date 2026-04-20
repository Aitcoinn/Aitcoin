import { logger } from '../lib/logger.js';

/**
 * ACHIEVEMENT_SYSTEM — Module #828
 * Achievement tracking system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface AchievementSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AchievementSystem {
  private states: Map<string, AchievementSystemState> = new Map();

  private getOrCreate(entityId: string): AchievementSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AchievementSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'achievement_system', value: state.value }, '[AchievementSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'achievement_system' }, '[AchievementSystem] Reset');
  }

  getState(entityId: string): AchievementSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AchievementSystemState> {
    return this.states;
  }
}

export const achievementSystem = new AchievementSystem();
export default achievementSystem;
