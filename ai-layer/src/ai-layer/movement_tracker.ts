import { logger } from '../lib/logger.js';

/**
 * MOVEMENT_TRACKER — Module #711
 * Movement tracking system
 * Kategori: PERSEPSI & REALITAS
 */
export interface MovementTrackerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MovementTracker {
  private states: Map<string, MovementTrackerState> = new Map();

  private getOrCreate(entityId: string): MovementTrackerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MovementTrackerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'movement_tracker', value: state.value }, '[MovementTracker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'movement_tracker' }, '[MovementTracker] Reset');
  }

  getState(entityId: string): MovementTrackerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MovementTrackerState> {
    return this.states;
  }
}

export const movementTracker = new MovementTracker();
export default movementTracker;
