import { logger } from '../lib/logger.js';

/**
 * PUNCTUATION_SYSTEM — Module #665
 * Punctuation management system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface PunctuationSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PunctuationSystem {
  private states: Map<string, PunctuationSystemState> = new Map();

  private getOrCreate(entityId: string): PunctuationSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PunctuationSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'punctuation_system', value: state.value }, '[PunctuationSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'punctuation_system' }, '[PunctuationSystem] Reset');
  }

  getState(entityId: string): PunctuationSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PunctuationSystemState> {
    return this.states;
  }
}

export const punctuationSystem = new PunctuationSystem();
export default punctuationSystem;
