import { logger } from '../lib/logger.js';

/**
 * SEMANTIC_PARSER — Module #661
 * Semantic parsing engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SemanticParserState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SemanticParser {
  private states: Map<string, SemanticParserState> = new Map();

  private getOrCreate(entityId: string): SemanticParserState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SemanticParserState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'semantic_parser', value: state.value }, '[SemanticParser] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'semantic_parser' }, '[SemanticParser] Reset');
  }

  getState(entityId: string): SemanticParserState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SemanticParserState> {
    return this.states;
  }
}

export const semanticParser = new SemanticParser();
export default semanticParser;
