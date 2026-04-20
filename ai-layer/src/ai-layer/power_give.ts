import { logger } from '../lib/logger.js';

/**
 * POWER_GIVE — Module #696
 * Power transfer system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface PowerGiveState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PowerGive {
  private states: Map<string, PowerGiveState> = new Map();

  private getOrCreate(entityId: string): PowerGiveState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PowerGiveState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'power_give', value: state.value }, '[PowerGive] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'power_give' }, '[PowerGive] Reset');
  }

  getState(entityId: string): PowerGiveState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PowerGiveState> {
    return this.states;
  }
}

export const powerGive = new PowerGive();
export default powerGive;
