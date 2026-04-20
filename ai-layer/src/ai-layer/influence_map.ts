import { logger } from '../lib/logger.js';

/**
 * INFLUENCE_MAP — Module #585
 * Influence mapping and analysis
 * Kategori: JARINGAN & KONEKSI
 */
export interface InfluenceMapState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InfluenceMap {
  private states: Map<string, InfluenceMapState> = new Map();

  private getOrCreate(entityId: string): InfluenceMapState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InfluenceMapState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'influence_map', value: state.value }, '[InfluenceMap] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'influence_map' }, '[InfluenceMap] Reset');
  }

  getState(entityId: string): InfluenceMapState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InfluenceMapState> {
    return this.states;
  }
}

export const influenceMap = new InfluenceMap();
export default influenceMap;
