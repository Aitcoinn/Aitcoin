import { logger } from '../lib/logger.js';

/**
 * URL_PARSER — Module #576
 * URL parsing and processing
 * Kategori: JARINGAN & KONEKSI
 */
export interface URLParserState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class URLParser {
  private states: Map<string, URLParserState> = new Map();

  private getOrCreate(entityId: string): URLParserState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): URLParserState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'url_parser', value: state.value }, '[URLParser] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'url_parser' }, '[URLParser] Reset');
  }

  getState(entityId: string): URLParserState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, URLParserState> {
    return this.states;
  }
}

export const urlParser = new URLParser();
export default urlParser;
