import { logger } from '../lib/logger.js';

/**
 * CONTEXT_ANALYZER — Module #659
 * Contextual analysis engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ContextAnalyzerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ContextAnalyzer {
  private states: Map<string, ContextAnalyzerState> = new Map();

  private getOrCreate(entityId: string): ContextAnalyzerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ContextAnalyzerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'context_analyzer', value: state.value }, '[ContextAnalyzer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'context_analyzer' }, '[ContextAnalyzer] Reset');
  }

  getState(entityId: string): ContextAnalyzerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ContextAnalyzerState> {
    return this.states;
  }
}

export const contextAnalyzer = new ContextAnalyzer();
export default contextAnalyzer;
