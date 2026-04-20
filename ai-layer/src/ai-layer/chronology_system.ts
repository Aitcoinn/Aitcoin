import { logger } from '../lib/logger.js';

/**
 * CHRONOLOGY_SYSTEM — Module #549
 * Event chronology management
 * Kategori: JARINGAN & KONEKSI
 */
export interface ChronologySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChronologySystem {
  private states: Map<string, ChronologySystemState> = new Map();

  private getOrCreate(entityId: string): ChronologySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChronologySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'chronology_system', value: state.value }, '[ChronologySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'chronology_system' }, '[ChronologySystem] Reset');
  }

  getState(entityId: string): ChronologySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChronologySystemState> {
    return this.states;
  }
}

export const chronologySystem = new ChronologySystem();
export default chronologySystem;
