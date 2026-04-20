import { logger } from '../lib/logger.js';

/**
 * DECISION_SHARE — Module #688
 * Decision sharing system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface DecisionShareState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DecisionShare {
  private states: Map<string, DecisionShareState> = new Map();

  private getOrCreate(entityId: string): DecisionShareState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DecisionShareState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'decision_share', value: state.value }, '[DecisionShare] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'decision_share' }, '[DecisionShare] Reset');
  }

  getState(entityId: string): DecisionShareState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DecisionShareState> {
    return this.states;
  }
}

export const decisionShare = new DecisionShare();
export default decisionShare;
