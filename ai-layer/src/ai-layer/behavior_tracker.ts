import { logger } from '../lib/logger.js';

/**
 * BEHAVIOR_TRACKER — Module #449
 * Behavior tracking and profiling
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface BehaviorTrackerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BehaviorTracker {
  private states: Map<string, BehaviorTrackerState> = new Map();

  private getOrCreate(entityId: string): BehaviorTrackerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BehaviorTrackerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'behavior_tracker', value: state.value }, '[BehaviorTracker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'behavior_tracker' }, '[BehaviorTracker] Reset');
  }

  getState(entityId: string): BehaviorTrackerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BehaviorTrackerState> {
    return this.states;
  }
}

export const behaviorTracker = new BehaviorTracker();
export default behaviorTracker;
