import { logger } from '../lib/logger.js';

/**
 * PAUSE_SYSTEM — Module #736
 * Simulation pause system
 * Kategori: PERSEPSI & REALITAS
 */
export interface PauseSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PauseSystem {
  private states: Map<string, PauseSystemState> = new Map();

  private getOrCreate(entityId: string): PauseSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PauseSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'pause_system', value: state.value }, '[PauseSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'pause_system' }, '[PauseSystem] Reset');
  }

  getState(entityId: string): PauseSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PauseSystemState> {
    return this.states;
  }
}

export const pauseSystem = new PauseSystem();
export default pauseSystem;
