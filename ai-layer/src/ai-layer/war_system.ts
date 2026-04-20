import { logger } from '../lib/logger.js';

/**
 * WAR_SYSTEM — Module #856
 * Warfare simulation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface WarSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WarSystem {
  private states: Map<string, WarSystemState> = new Map();

  private getOrCreate(entityId: string): WarSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WarSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'war_system', value: state.value }, '[WarSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'war_system' }, '[WarSystem] Reset');
  }

  getState(entityId: string): WarSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WarSystemState> {
    return this.states;
  }
}

export const warSystem = new WarSystem();
export default warSystem;
