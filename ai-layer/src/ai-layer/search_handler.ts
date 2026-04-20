import { logger } from '../lib/logger.js';

/**
 * SEARCH_HANDLER — Module #676
 * Search request handling
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SearchHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SearchHandler {
  private states: Map<string, SearchHandlerState> = new Map();

  private getOrCreate(entityId: string): SearchHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SearchHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'search_handler', value: state.value }, '[SearchHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'search_handler' }, '[SearchHandler] Reset');
  }

  getState(entityId: string): SearchHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SearchHandlerState> {
    return this.states;
  }
}

export const searchHandler = new SearchHandler();
export default searchHandler;
