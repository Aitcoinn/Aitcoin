import { logger } from '../lib/logger.js';

/**
 * METAPHOR_MAKER — Module #616
 * Metaphor generation engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface MetaphorMakerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MetaphorMaker {
  private states: Map<string, MetaphorMakerState> = new Map();

  private getOrCreate(entityId: string): MetaphorMakerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MetaphorMakerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'metaphor_maker', value: state.value }, '[MetaphorMaker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'metaphor_maker' }, '[MetaphorMaker] Reset');
  }

  getState(entityId: string): MetaphorMakerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MetaphorMakerState> {
    return this.states;
  }
}

export const metaphorMaker = new MetaphorMaker();
export default metaphorMaker;
