import { logger } from '../lib/logger.js';

/**
 * PRIZE_GIVER — Module #820
 * Prize allocation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface PrizeGiverState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PrizeGiver {
  private states: Map<string, PrizeGiverState> = new Map();

  private getOrCreate(entityId: string): PrizeGiverState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PrizeGiverState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'prize_giver', value: state.value }, '[PrizeGiver] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'prize_giver' }, '[PrizeGiver] Reset');
  }

  getState(entityId: string): PrizeGiverState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PrizeGiverState> {
    return this.states;
  }
}

export const prizeGiver = new PrizeGiver();
export default prizeGiver;
