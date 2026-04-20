import { logger } from '../lib/logger.js';

/**
 * BATTLE_ENGINE — Module #857
 * Battle simulation engine
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface BattleEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BattleEngine {
  private states: Map<string, BattleEngineState> = new Map();

  private getOrCreate(entityId: string): BattleEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BattleEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'battle_engine', value: state.value }, '[BattleEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'battle_engine' }, '[BattleEngine] Reset');
  }

  getState(entityId: string): BattleEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BattleEngineState> {
    return this.states;
  }
}

export const battleEngine = new BattleEngine();
export default battleEngine;
