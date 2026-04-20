import { logger } from '../lib/logger.js';

/**
 * DATA_HIGHWAY — Module #588
 * High-speed data highway
 * Kategori: JARINGAN & KONEKSI
 */
export interface DataHighwayState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DataHighway {
  private states: Map<string, DataHighwayState> = new Map();

  private getOrCreate(entityId: string): DataHighwayState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DataHighwayState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'data_highway', value: state.value }, '[DataHighway] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'data_highway' }, '[DataHighway] Reset');
  }

  getState(entityId: string): DataHighwayState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DataHighwayState> {
    return this.states;
  }
}

export const dataHighway = new DataHighway();
export default dataHighway;
