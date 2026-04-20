import { logger } from '../lib/logger.js';

/**
 * TEXT_PROCESSOR — Module #310
 * Processes and analyzes text content
 * Kategori: MESIN & SISTEM
 */
export interface TextProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TextProcessor {
  private states: Map<string, TextProcessorState> = new Map();

  private getOrCreate(entityId: string): TextProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TextProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'text_processor', value: state.value }, '[TextProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'text_processor' }, '[TextProcessor] Reset');
  }

  getState(entityId: string): TextProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TextProcessorState> {
    return this.states;
  }
}

export const textProcessor = new TextProcessor();
export default textProcessor;
