import { logger } from '../lib/logger.js';

/**
 * SHORTEST_PATH — Module #519
 * Shortest path computation
 * Kategori: JARINGAN & KONEKSI
 */
export interface ShortestPathState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ShortestPath {
  private states: Map<string, ShortestPathState> = new Map();

  private getOrCreate(entityId: string): ShortestPathState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ShortestPathState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'shortest_path', value: state.value }, '[ShortestPath] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'shortest_path' }, '[ShortestPath] Reset');
  }

  getState(entityId: string): ShortestPathState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ShortestPathState> {
    return this.states;
  }
}

export const shortestPath = new ShortestPath();
export default shortestPath;
