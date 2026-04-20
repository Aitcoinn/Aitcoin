import { logger } from '../lib/logger.js';

/**
 * MAIN_SYSTEM — Module #302
 * Main system orchestrator
 * Kategori: MESIN & SISTEM
 */
export interface MainSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MainSystem {
  private states: Map<string, MainSystemState> = new Map();

  private getOrCreate(entityId: string): MainSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MainSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'main_system', value: state.value }, '[MainSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'main_system' }, '[MainSystem] Reset');
  }

  getState(entityId: string): MainSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MainSystemState> {
    return this.states;
  }
}

export const mainSystem = new MainSystem();
export default mainSystem;
