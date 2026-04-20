import { logger } from '../lib/logger.js';

/**
 * CODE_LANGUAGE — Module #634
 * Programming language processor
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface CodeLanguageState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CodeLanguage {
  private states: Map<string, CodeLanguageState> = new Map();

  private getOrCreate(entityId: string): CodeLanguageState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CodeLanguageState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'code_language', value: state.value }, '[CodeLanguage] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'code_language' }, '[CodeLanguage] Reset');
  }

  getState(entityId: string): CodeLanguageState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CodeLanguageState> {
    return this.states;
  }
}

export const codeLanguage = new CodeLanguage();
export default codeLanguage;
