import { logger } from '../lib/logger.js';

/**
 * SYNTACTIC_ANALYZER — Module #662
 * Syntactic structure analysis
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SyntacticAnalyzerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SyntacticAnalyzer {
  private states: Map<string, SyntacticAnalyzerState> = new Map();

  private getOrCreate(entityId: string): SyntacticAnalyzerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SyntacticAnalyzerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'syntactic_analyzer', value: state.value }, '[SyntacticAnalyzer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'syntactic_analyzer' }, '[SyntacticAnalyzer] Reset');
  }

  getState(entityId: string): SyntacticAnalyzerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SyntacticAnalyzerState> {
    return this.states;
  }
}

export const syntacticAnalyzer = new SyntacticAnalyzer();
export default syntacticAnalyzer;
