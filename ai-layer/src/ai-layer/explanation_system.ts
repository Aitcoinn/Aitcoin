import { logger } from '../lib/logger.js';

/**
 * EXPLANATION_SYSTEM — Module #619
 * Explanation generation system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ExplanationSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ExplanationSystem {
  private states: Map<string, ExplanationSystemState> = new Map();

  private getOrCreate(entityId: string): ExplanationSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ExplanationSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'explanation_system', value: state.value }, '[ExplanationSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'explanation_system' }, '[ExplanationSystem] Reset');
  }

  getState(entityId: string): ExplanationSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ExplanationSystemState> {
    return this.states;
  }
}

export const explanationSystem = new ExplanationSystem();
export default explanationSystem;
