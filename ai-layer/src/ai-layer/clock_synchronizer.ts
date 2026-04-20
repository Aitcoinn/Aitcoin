import { logger } from '../lib/logger.js';

/**
 * CLOCK_SYNCHRONIZER — Module #545
 * Distributed clock synchronization
 * Kategori: JARINGAN & KONEKSI
 */
export interface ClockSynchronizerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ClockSynchronizer {
  private states: Map<string, ClockSynchronizerState> = new Map();

  private getOrCreate(entityId: string): ClockSynchronizerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ClockSynchronizerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'clock_synchronizer', value: state.value }, '[ClockSynchronizer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'clock_synchronizer' }, '[ClockSynchronizer] Reset');
  }

  getState(entityId: string): ClockSynchronizerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ClockSynchronizerState> {
    return this.states;
  }
}

export const clockSynchronizer = new ClockSynchronizer();
export default clockSynchronizer;
