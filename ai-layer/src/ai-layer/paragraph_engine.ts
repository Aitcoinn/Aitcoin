import { logger } from '../lib/logger.js';

/**
 * PARAGRAPH_ENGINE — Module #649
 * Paragraph structure engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ParagraphEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ParagraphEngine {
  private states: Map<string, ParagraphEngineState> = new Map();

  private getOrCreate(entityId: string): ParagraphEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ParagraphEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'paragraph_engine', value: state.value }, '[ParagraphEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'paragraph_engine' }, '[ParagraphEngine] Reset');
  }

  getState(entityId: string): ParagraphEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ParagraphEngineState> {
    return this.states;
  }
}

export const paragraphEngine = new ParagraphEngine();
export default paragraphEngine;
