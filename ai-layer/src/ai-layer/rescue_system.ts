import { logger } from '../lib/logger.js';

/**
 * RESCUE_SYSTEM — Module #880
 * Rescue operation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface RescueSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RescueSystem {
  private states: Map<string, RescueSystemState> = new Map();

  private getOrCreate(entityId: string): RescueSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RescueSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rescue_system', value: state.value }, '[RescueSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rescue_system' }, '[RescueSystem] Reset');
  }

  getState(entityId: string): RescueSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RescueSystemState> {
    return this.states;
  }
}

export const rescueSystem = new RescueSystem();
export default rescueSystem;
