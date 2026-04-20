import { logger } from '../lib/logger.js';

/**
 * FASTEST_ROUTE — Module #520
 * Fastest route selection
 * Kategori: JARINGAN & KONEKSI
 */
export interface FastestRouteState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FastestRoute {
  private states: Map<string, FastestRouteState> = new Map();

  private getOrCreate(entityId: string): FastestRouteState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FastestRouteState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'fastest_route', value: state.value }, '[FastestRoute] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'fastest_route' }, '[FastestRoute] Reset');
  }

  getState(entityId: string): FastestRouteState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FastestRouteState> {
    return this.states;
  }
}

export const fastestRoute = new FastestRoute();
export default fastestRoute;
