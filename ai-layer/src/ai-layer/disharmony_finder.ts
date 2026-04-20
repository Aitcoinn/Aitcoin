import { logger } from '../lib/logger.js';

/**
 * DISHARMONY_FINDER — Module #760
 * Disharmony detection engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface DisharmonyFinderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DisharmonyFinder {
  private states: Map<string, DisharmonyFinderState> = new Map();

  private getOrCreate(entityId: string): DisharmonyFinderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DisharmonyFinderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'disharmony_finder', value: state.value }, '[DisharmonyFinder] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'disharmony_finder' }, '[DisharmonyFinder] Reset');
  }

  getState(entityId: string): DisharmonyFinderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DisharmonyFinderState> {
    return this.states;
  }
}

export const disharmonyFinder = new DisharmonyFinder();
export default disharmonyFinder;
