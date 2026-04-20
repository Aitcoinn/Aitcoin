import { logger } from '../lib/logger.js';

/**
 * IRREGULARITY_FINDER — Module #450
 * Irregularity detection system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface IrregularityFinderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IrregularityFinder {
  private states: Map<string, IrregularityFinderState> = new Map();

  private getOrCreate(entityId: string): IrregularityFinderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IrregularityFinderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'irregularity_finder', value: state.value }, '[IrregularityFinder] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'irregularity_finder' }, '[IrregularityFinder] Reset');
  }

  getState(entityId: string): IrregularityFinderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IrregularityFinderState> {
    return this.states;
  }
}

export const irregularityFinder = new IrregularityFinder();
export default irregularityFinder;
