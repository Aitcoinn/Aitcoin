import { logger } from '../lib/logger.js';

/**
 * IDEA_EXCHANGE — Module #689
 * Idea exchange platform
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface IdeaExchangeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IdeaExchange {
  private states: Map<string, IdeaExchangeState> = new Map();

  private getOrCreate(entityId: string): IdeaExchangeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IdeaExchangeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'idea_exchange', value: state.value }, '[IdeaExchange] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'idea_exchange' }, '[IdeaExchange] Reset');
  }

  getState(entityId: string): IdeaExchangeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IdeaExchangeState> {
    return this.states;
  }
}

export const ideaExchange = new IdeaExchange();
export default ideaExchange;
