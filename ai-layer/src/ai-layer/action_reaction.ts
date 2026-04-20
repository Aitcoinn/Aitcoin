import { logger } from '../lib/logger.js';

/**
 * ACTION_REACTION — Module #775
 * Action-reaction system
 * Kategori: PERSEPSI & REALITAS
 */
export interface ActionReactionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ActionReaction {
  private states: Map<string, ActionReactionState> = new Map();

  private getOrCreate(entityId: string): ActionReactionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ActionReactionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'action_reaction', value: state.value }, '[ActionReaction] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'action_reaction' }, '[ActionReaction] Reset');
  }

  getState(entityId: string): ActionReactionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ActionReactionState> {
    return this.states;
  }
}

export const actionReaction = new ActionReaction();
export default actionReaction;
