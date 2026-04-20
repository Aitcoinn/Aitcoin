import { logger } from '../lib/logger.js';

/**
 * HISTORY_TRACKER — Module #551
 * Historical event tracking
 * Kategori: JARINGAN & KONEKSI
 */
export interface HistoryTrackerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HistoryTracker {
  private states: Map<string, HistoryTrackerState> = new Map();

  private getOrCreate(entityId: string): HistoryTrackerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HistoryTrackerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'history_tracker', value: state.value }, '[HistoryTracker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'history_tracker' }, '[HistoryTracker] Reset');
  }

  getState(entityId: string): HistoryTrackerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HistoryTrackerState> {
    return this.states;
  }
}

export const historyTracker = new HistoryTracker();
export default historyTracker;
