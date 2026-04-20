import { logger } from '../lib/logger.js';

/**
 * REWARD_SYSTEM — Module #819
 * Reward and incentive system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface RewardSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RewardSystem {
  private states: Map<string, RewardSystemState> = new Map();

  private getOrCreate(entityId: string): RewardSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RewardSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reward_system', value: state.value }, '[RewardSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reward_system' }, '[RewardSystem] Reset');
  }

  getState(entityId: string): RewardSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RewardSystemState> {
    return this.states;
  }
}

export const rewardSystem = new RewardSystem();
export default rewardSystem;
