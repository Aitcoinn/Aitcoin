import { logger } from '../lib/logger.js';

/**
 * ALERT_SYSTEM — Module #875
 * Emergency alert system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface AlertSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AlertSystem {
  private states: Map<string, AlertSystemState> = new Map();

  private getOrCreate(entityId: string): AlertSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AlertSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'alert_system', value: state.value }, '[AlertSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'alert_system' }, '[AlertSystem] Reset');
  }

  getState(entityId: string): AlertSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AlertSystemState> {
    return this.states;
  }
}

export const alertSystem = new AlertSystem();
export default alertSystem;
