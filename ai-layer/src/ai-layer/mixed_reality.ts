import { logger } from '../lib/logger.js';

/**
 * MIXED_REALITY — Module #728
 * Mixed reality system
 * Kategori: PERSEPSI & REALITAS
 */
export interface MixedRealityState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MixedReality {
  private states: Map<string, MixedRealityState> = new Map();

  private getOrCreate(entityId: string): MixedRealityState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MixedRealityState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mixed_reality', value: state.value }, '[MixedReality] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'mixed_reality' }, '[MixedReality] Reset');
  }

  getState(entityId: string): MixedRealityState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MixedRealityState> {
    return this.states;
  }
}

export const mixedReality = new MixedReality();
export default mixedReality;
