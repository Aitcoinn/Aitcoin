import { logger } from '../lib/logger.js';

/**
 * REACTION_ENGINE — Module #328
 * Reaction processing and stimulus handling
 * Kategori: MESIN & SISTEM
 */
export interface ReactionEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ReactionEngine {
  private states: Map<string, ReactionEngineState> = new Map();

  private getOrCreate(entityId: string): ReactionEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ReactionEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reaction_engine', value: state.value }, '[ReactionEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reaction_engine' }, '[ReactionEngine] Reset');
  }

  getState(entityId: string): ReactionEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ReactionEngineState> {
    return this.states;
  }
}

export const reactionEngine = new ReactionEngine();
export default reactionEngine;
