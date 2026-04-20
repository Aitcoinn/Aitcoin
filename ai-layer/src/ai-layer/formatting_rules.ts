import { logger } from '../lib/logger.js';

/**
 * FORMATTING_RULES — Module #667
 * Text formatting rules engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface FormattingRulesState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FormattingRules {
  private states: Map<string, FormattingRulesState> = new Map();

  private getOrCreate(entityId: string): FormattingRulesState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FormattingRulesState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'formatting_rules', value: state.value }, '[FormattingRules] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'formatting_rules' }, '[FormattingRules] Reset');
  }

  getState(entityId: string): FormattingRulesState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FormattingRulesState> {
    return this.states;
  }
}

export const formattingRules = new FormattingRules();
export default formattingRules;
