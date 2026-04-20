import { logger } from '../lib/logger.js';

/**
 * STRATEGY_GAME — Module #858
 * Strategic game engine
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface StrategyGameState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StrategyGame {
  private states: Map<string, StrategyGameState> = new Map();

  private getOrCreate(entityId: string): StrategyGameState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StrategyGameState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'strategy_game', value: state.value }, '[StrategyGame] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'strategy_game' }, '[StrategyGame] Reset');
  }

  getState(entityId: string): StrategyGameState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StrategyGameState> {
    return this.states;
  }
}

export const strategyGame = new StrategyGame();
export default strategyGame;
