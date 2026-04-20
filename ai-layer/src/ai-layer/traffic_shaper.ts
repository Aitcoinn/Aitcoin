import { logger } from '../lib/logger.js';

/**
 * TRAFFIC_SHAPER — Module #521
 * Network traffic shaping
 * Kategori: JARINGAN & KONEKSI
 */
export interface TrafficShaperState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TrafficShaper {
  private states: Map<string, TrafficShaperState> = new Map();

  private getOrCreate(entityId: string): TrafficShaperState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TrafficShaperState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'traffic_shaper', value: state.value }, '[TrafficShaper] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'traffic_shaper' }, '[TrafficShaper] Reset');
  }

  getState(entityId: string): TrafficShaperState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TrafficShaperState> {
    return this.states;
  }
}

export const trafficShaper = new TrafficShaper();
export default trafficShaper;
