import { logger } from '../lib/logger.js';

/**
 * POLYSEMY_SYSTEM — Module #658
 * Polysemy handling system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface PolysemySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PolysemySystem {
  private states: Map<string, PolysemySystemState> = new Map();

  private getOrCreate(entityId: string): PolysemySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PolysemySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'polysemy_system', value: state.value }, '[PolysemySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'polysemy_system' }, '[PolysemySystem] Reset');
  }

  getState(entityId: string): PolysemySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PolysemySystemState> {
    return this.states;
  }
}

export const polysemySystem = new PolysemySystem();
export default polysemySystem;
