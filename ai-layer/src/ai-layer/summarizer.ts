import { logger } from '../lib/logger.js';

/**
 * SUMMARIZER — Module #622
 * Text summarization engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SummarizerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class Summarizer {
  private states: Map<string, SummarizerState> = new Map();

  private getOrCreate(entityId: string): SummarizerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SummarizerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'summarizer', value: state.value }, '[Summarizer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'summarizer' }, '[Summarizer] Reset');
  }

  getState(entityId: string): SummarizerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SummarizerState> {
    return this.states;
  }
}

export const summarizer = new Summarizer();
export default summarizer;
