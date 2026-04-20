import { logger } from '../lib/logger.js';

/**
 * JOY_CREATOR — Module #961
 * Joy creation engine
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface JoyCreatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class JoyCreator {
  private states: Map<string, JoyCreatorState> = new Map();

  private getOrCreate(entityId: string): JoyCreatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): JoyCreatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'joy_creator', value: state.value }, '[JoyCreator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'joy_creator' }, '[JoyCreator] Reset');
  }

  getState(entityId: string): JoyCreatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, JoyCreatorState> {
    return this.states;
  }
}

export const joyCreator = new JoyCreator();
export default joyCreator;
