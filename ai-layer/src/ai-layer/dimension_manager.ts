import { logger } from '../lib/logger.js';

/**
 * DIMENSION_MANAGER — Module #739
 * Dimensional management system
 * Kategori: PERSEPSI & REALITAS
 */
export interface DimensionManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DimensionManager {
  private states: Map<string, DimensionManagerState> = new Map();

  private getOrCreate(entityId: string): DimensionManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DimensionManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'dimension_manager', value: state.value }, '[DimensionManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'dimension_manager' }, '[DimensionManager] Reset');
  }

  getState(entityId: string): DimensionManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DimensionManagerState> {
    return this.states;
  }
}

export const dimensionManager = new DimensionManager();
export default dimensionManager;
