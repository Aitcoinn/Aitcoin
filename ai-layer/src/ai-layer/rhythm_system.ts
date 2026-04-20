import { logger } from '../lib/logger.js';

/**
 * RHYTHM_SYSTEM — Module #359
 * Rhythmic pattern and timing system
 * Kategori: MESIN & SISTEM
 */
export interface RhythmSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RhythmSystem {
  private states: Map<string, RhythmSystemState> = new Map();

  private getOrCreate(entityId: string): RhythmSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RhythmSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rhythm_system', value: state.value }, '[RhythmSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rhythm_system' }, '[RhythmSystem] Reset');
  }

  getState(entityId: string): RhythmSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RhythmSystemState> {
    return this.states;
  }
}

export const rhythmSystem = new RhythmSystem();
export default rhythmSystem;
