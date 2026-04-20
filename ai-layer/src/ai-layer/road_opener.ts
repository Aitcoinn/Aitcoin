import { logger } from '../lib/logger.js';

/**
 * ROAD_OPENER — Module #947
 * Path opening system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface RoadOpenerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RoadOpener {
  private states: Map<string, RoadOpenerState> = new Map();

  private getOrCreate(entityId: string): RoadOpenerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RoadOpenerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'road_opener', value: state.value }, '[RoadOpener] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'road_opener' }, '[RoadOpener] Reset');
  }

  getState(entityId: string): RoadOpenerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RoadOpenerState> {
    return this.states;
  }
}

export const roadOpener = new RoadOpener();
export default roadOpener;
