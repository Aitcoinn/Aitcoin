import { logger } from '../lib/logger.js';

/**
 * STABILITY_MONITOR — Module #362
 * System stability monitoring
 * Kategori: MESIN & SISTEM
 */
export interface StabilityMonitorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StabilityMonitor {
  private states: Map<string, StabilityMonitorState> = new Map();

  private getOrCreate(entityId: string): StabilityMonitorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StabilityMonitorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'stability_monitor', value: state.value }, '[StabilityMonitor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'stability_monitor' }, '[StabilityMonitor] Reset');
  }

  getState(entityId: string): StabilityMonitorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StabilityMonitorState> {
    return this.states;
  }
}

export const stabilityMonitor = new StabilityMonitor();
export default stabilityMonitor;
