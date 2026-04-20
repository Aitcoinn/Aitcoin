import { logger } from '../lib/logger.js';

/**
 * RANK_SYSTEM — Module #825
 * Ranking and tier system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface RankSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RankSystem {
  private states: Map<string, RankSystemState> = new Map();

  private getOrCreate(entityId: string): RankSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RankSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rank_system', value: state.value }, '[RankSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rank_system' }, '[RankSystem] Reset');
  }

  getState(entityId: string): RankSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RankSystemState> {
    return this.states;
  }
}

export const rankSystem = new RankSystem();
export default rankSystem;
