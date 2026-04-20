import { logger } from '../lib/logger.js';

/**
 * LEVEL_UP_ENGINE — Module #924
 * Level advancement engine
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface LevelUpEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LevelUpEngine {
  private states: Map<string, LevelUpEngineState> = new Map();

  private getOrCreate(entityId: string): LevelUpEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LevelUpEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'level_up_engine', value: state.value }, '[LevelUpEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'level_up_engine' }, '[LevelUpEngine] Reset');
  }

  getState(entityId: string): LevelUpEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LevelUpEngineState> {
    return this.states;
  }
}

export const levelUpEngine = new LevelUpEngine();
export default levelUpEngine;
