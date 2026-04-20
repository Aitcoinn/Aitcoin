import { logger } from '../lib/logger.js';

/**
 * ALERT_DISTRIBUTOR — Module #538
 * Alert distribution system
 * Kategori: JARINGAN & KONEKSI
 */
export interface AlertDistributorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AlertDistributor {
  private states: Map<string, AlertDistributorState> = new Map();

  private getOrCreate(entityId: string): AlertDistributorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AlertDistributorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'alert_distributor', value: state.value }, '[AlertDistributor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'alert_distributor' }, '[AlertDistributor] Reset');
  }

  getState(entityId: string): AlertDistributorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AlertDistributorState> {
    return this.states;
  }
}

export const alertDistributor = new AlertDistributor();
export default alertDistributor;
