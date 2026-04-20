import { logger } from '../lib/logger.js';

/**
 * REALITY_COLLAPSER — Module #785
 * Reality wave function collapse
 * Kategori: PERSEPSI & REALITAS
 */
export interface RealityCollapserState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RealityCollapser {
  private states: Map<string, RealityCollapserState> = new Map();

  private getOrCreate(entityId: string): RealityCollapserState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RealityCollapserState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reality_collapser', value: state.value }, '[RealityCollapser] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reality_collapser' }, '[RealityCollapser] Reset');
  }

  getState(entityId: string): RealityCollapserState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RealityCollapserState> {
    return this.states;
  }
}

export const realityCollapser = new RealityCollapser();
export default realityCollapser;
