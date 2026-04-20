import { logger } from '../lib/logger.js';

/**
 * TRAFFIC_MANAGER — Module #352
 * Data traffic management and routing
 * Kategori: MESIN & SISTEM
 */
export interface TrafficManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TrafficManager {
  private states: Map<string, TrafficManagerState> = new Map();

  private getOrCreate(entityId: string): TrafficManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TrafficManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'traffic_manager', value: state.value }, '[TrafficManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'traffic_manager' }, '[TrafficManager] Reset');
  }

  getState(entityId: string): TrafficManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TrafficManagerState> {
    return this.states;
  }
}

export const trafficManager = new TrafficManager();
export default trafficManager;
