import { logger } from '../lib/logger.js';

/**
 * POWER_MANAGER — Module #348
 * Power allocation and management
 * Kategori: MESIN & SISTEM
 */
export interface PowerManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PowerManager {
  private states: Map<string, PowerManagerState> = new Map();

  private getOrCreate(entityId: string): PowerManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PowerManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'power_manager', value: state.value }, '[PowerManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'power_manager' }, '[PowerManager] Reset');
  }

  getState(entityId: string): PowerManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PowerManagerState> {
    return this.states;
  }
}

export const powerManager = new PowerManager();
export default powerManager;
