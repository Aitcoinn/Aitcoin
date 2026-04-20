import { logger } from '../lib/logger.js';

/**
 * SIGN_LANGUAGE — Module #629
 * Sign language processing
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SignLanguageState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SignLanguage {
  private states: Map<string, SignLanguageState> = new Map();

  private getOrCreate(entityId: string): SignLanguageState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SignLanguageState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sign_language', value: state.value }, '[SignLanguage] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sign_language' }, '[SignLanguage] Reset');
  }

  getState(entityId: string): SignLanguageState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SignLanguageState> {
    return this.states;
  }
}

export const signLanguage = new SignLanguage();
export default signLanguage;
