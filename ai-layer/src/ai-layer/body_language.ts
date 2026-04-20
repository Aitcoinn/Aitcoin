import { logger } from '../lib/logger.js';

/**
 * BODY_LANGUAGE — Module #630
 * Body language interpretation
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface BodyLanguageState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BodyLanguage {
  private states: Map<string, BodyLanguageState> = new Map();

  private getOrCreate(entityId: string): BodyLanguageState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BodyLanguageState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'body_language', value: state.value }, '[BodyLanguage] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'body_language' }, '[BodyLanguage] Reset');
  }

  getState(entityId: string): BodyLanguageState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BodyLanguageState> {
    return this.states;
  }
}

export const bodyLanguage = new BodyLanguage();
export default bodyLanguage;
