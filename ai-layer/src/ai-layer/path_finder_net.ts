import { logger } from '../lib/logger.js';

/**
 * PATH_FINDER_NET — Module #518
 * Network path finding algorithm
 * Kategori: JARINGAN & KONEKSI
 */
export interface PathFinderNetState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PathFinderNet {
  private states: Map<string, PathFinderNetState> = new Map();

  private getOrCreate(entityId: string): PathFinderNetState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PathFinderNetState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'path_finder_net', value: state.value }, '[PathFinderNet] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'path_finder_net' }, '[PathFinderNet] Reset');
  }

  getState(entityId: string): PathFinderNetState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PathFinderNetState> {
    return this.states;
  }
}

export const pathFinderNet = new PathFinderNet();
export default pathFinderNet;
