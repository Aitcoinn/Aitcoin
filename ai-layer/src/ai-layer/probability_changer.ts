import { logger } from '../lib/logger.js';

/**
 * PROBABILITY_CHANGER — Module #765
 * Probability manipulation engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface ProbabilityChangerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ProbabilityChanger {
  private states: Map<string, ProbabilityChangerState> = new Map();

  private getOrCreate(entityId: string): ProbabilityChangerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ProbabilityChangerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'probability_changer', value: state.value }, '[ProbabilityChanger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'probability_changer' }, '[ProbabilityChanger] Reset');
  }

  getState(entityId: string): ProbabilityChangerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ProbabilityChangerState> {
    return this.states;
  }
}

export const probabilityChanger = new ProbabilityChanger();
export default probabilityChanger;
