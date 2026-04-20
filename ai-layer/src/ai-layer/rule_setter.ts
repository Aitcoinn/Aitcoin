import { logger } from '../lib/logger.js';

/**
 * RULE_SETTER — Module #810
 * Rule creation and management
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface RuleSetterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RuleSetter {
  private states: Map<string, RuleSetterState> = new Map();

  private getOrCreate(entityId: string): RuleSetterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RuleSetterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rule_setter', value: state.value }, '[RuleSetter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rule_setter' }, '[RuleSetter] Reset');
  }

  getState(entityId: string): RuleSetterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RuleSetterState> {
    return this.states;
  }
}

export const ruleSetter = new RuleSetter();
export default ruleSetter;
