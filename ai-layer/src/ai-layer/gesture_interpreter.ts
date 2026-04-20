import { logger } from '../lib/logger.js';

/**
 * GESTURE_INTERPRETER — Module #710
 * Gesture interpretation system
 * Kategori: PERSEPSI & REALITAS
 */
export interface GestureInterpreterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GestureInterpreter {
  private states: Map<string, GestureInterpreterState> = new Map();

  private getOrCreate(entityId: string): GestureInterpreterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GestureInterpreterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'gesture_interpreter', value: state.value }, '[GestureInterpreter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'gesture_interpreter' }, '[GestureInterpreter] Reset');
  }

  getState(entityId: string): GestureInterpreterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GestureInterpreterState> {
    return this.states;
  }
}

export const gestureInterpreter = new GestureInterpreter();
export default gestureInterpreter;
