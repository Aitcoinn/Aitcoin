import { logger } from '../lib/logger.js';

/**
 * PERFORMANCE_TRACKER — Module #346
 * Performance monitoring and tracking
 * Kategori: MESIN & SISTEM
 */
export interface PerformanceTrackerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PerformanceTracker {
  private states: Map<string, PerformanceTrackerState> = new Map();

  private getOrCreate(entityId: string): PerformanceTrackerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PerformanceTrackerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'performance_tracker', value: state.value }, '[PerformanceTracker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'performance_tracker' }, '[PerformanceTracker] Reset');
  }

  getState(entityId: string): PerformanceTrackerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PerformanceTrackerState> {
    return this.states;
  }
}

export const performanceTracker = new PerformanceTracker();
export default performanceTracker;
