import { logger } from '../lib/logger.js';

/**
 * TIMELINE_MANAGER — Module #550
 * Timeline management and replay
 * Kategori: JARINGAN & KONEKSI
 */
export interface TimelineManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TimelineManager {
  private states: Map<string, TimelineManagerState> = new Map();

  private getOrCreate(entityId: string): TimelineManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TimelineManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'timeline_manager', value: state.value }, '[TimelineManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'timeline_manager' }, '[TimelineManager] Reset');
  }

  getState(entityId: string): TimelineManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TimelineManagerState> {
    return this.states;
  }
}

export const timelineManager = new TimelineManager();
export default timelineManager;
