import { logger } from '../lib/logger.js';

/**
 * TEXT_FORMATTER — Module #647
 * Text formatting and layout
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface TextFormatterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TextFormatter {
  private states: Map<string, TextFormatterState> = new Map();

  private getOrCreate(entityId: string): TextFormatterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TextFormatterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'text_formatter', value: state.value }, '[TextFormatter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'text_formatter' }, '[TextFormatter] Reset');
  }

  getState(entityId: string): TextFormatterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TextFormatterState> {
    return this.states;
  }
}

export const textFormatter = new TextFormatter();
export default textFormatter;
