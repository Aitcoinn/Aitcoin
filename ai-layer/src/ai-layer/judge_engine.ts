import { logger } from '../lib/logger.js';

/**
 * JUDGE_ENGINE — Module #815
 * Judgment and verdict engine
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface JudgeEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class JudgeEngine {
  private states: Map<string, JudgeEngineState> = new Map();

  private getOrCreate(entityId: string): JudgeEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): JudgeEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'judge_engine', value: state.value }, '[JudgeEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'judge_engine' }, '[JudgeEngine] Reset');
  }

  getState(entityId: string): JudgeEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, JudgeEngineState> {
    return this.states;
  }
}

export const judgeEngine = new JudgeEngine();
export default judgeEngine;
