import { logger } from '../lib/logger.js';

/**
 * CONGESTION_CONTROL — Module #522
 * Network congestion control
 * Kategori: JARINGAN & KONEKSI
 */
export interface CongestionControlState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CongestionControl {
  private states: Map<string, CongestionControlState> = new Map();

  private getOrCreate(entityId: string): CongestionControlState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CongestionControlState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'congestion_control', value: state.value }, '[CongestionControl] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'congestion_control' }, '[CongestionControl] Reset');
  }

  getState(entityId: string): CongestionControlState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CongestionControlState> {
    return this.states;
  }
}

export const congestionControl = new CongestionControl();
export default congestionControl;
