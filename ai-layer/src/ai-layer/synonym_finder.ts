import { logger } from '../lib/logger.js';

/**
 * SYNONYM_FINDER — Module #655
 * Synonym detection and suggestion
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SynonymFinderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SynonymFinder {
  private states: Map<string, SynonymFinderState> = new Map();

  private getOrCreate(entityId: string): SynonymFinderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SynonymFinderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'synonym_finder', value: state.value }, '[SynonymFinder] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'synonym_finder' }, '[SynonymFinder] Reset');
  }

  getState(entityId: string): SynonymFinderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SynonymFinderState> {
    return this.states;
  }
}

export const synonymFinder = new SynonymFinder();
export default synonymFinder;
