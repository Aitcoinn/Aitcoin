import { logger } from '../lib/logger.js';

/**
 * SURVEY_SYSTEM — Module #685
 * Survey management system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SurveySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SurveySystem {
  private states: Map<string, SurveySystemState> = new Map();

  private getOrCreate(entityId: string): SurveySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SurveySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'survey_system', value: state.value }, '[SurveySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'survey_system' }, '[SurveySystem] Reset');
  }

  getState(entityId: string): SurveySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SurveySystemState> {
    return this.states;
  }
}

export const surveySystem = new SurveySystem();
export default surveySystem;
