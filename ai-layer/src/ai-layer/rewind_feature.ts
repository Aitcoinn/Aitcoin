import { logger } from '../lib/logger.js';

/**
 * REWIND_FEATURE — Module #737
 * Time rewind feature
 * Kategori: PERSEPSI & REALITAS
 */
export interface RewindFeatureState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RewindFeature {
  private states: Map<string, RewindFeatureState> = new Map();

  private getOrCreate(entityId: string): RewindFeatureState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RewindFeatureState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rewind_feature', value: state.value }, '[RewindFeature] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rewind_feature' }, '[RewindFeature] Reset');
  }

  getState(entityId: string): RewindFeatureState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RewindFeatureState> {
    return this.states;
  }
}

export const rewindFeature = new RewindFeature();
export default rewindFeature;
