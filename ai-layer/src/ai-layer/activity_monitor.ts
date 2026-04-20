import { logger } from '../lib/logger.js';

/**
 * ACTIVITY_MONITOR — Module #448
 * System activity monitoring
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface ActivityMonitorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ActivityMonitor {
  private states: Map<string, ActivityMonitorState> = new Map();

  private getOrCreate(entityId: string): ActivityMonitorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ActivityMonitorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'activity_monitor', value: state.value }, '[ActivityMonitor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'activity_monitor' }, '[ActivityMonitor] Reset');
  }

  getState(entityId: string): ActivityMonitorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ActivityMonitorState> {
    return this.states;
  }
}

export const activityMonitor = new ActivityMonitor();
export default activityMonitor;
