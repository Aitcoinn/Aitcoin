import { logger } from '../lib/logger.js';

/**
 * CACHE_MANAGER — Module #371
 * Intelligent caching system
 * Kategori: MESIN & SISTEM
 */
export interface CacheManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CacheManager {
  private states: Map<string, CacheManagerState> = new Map();

  private getOrCreate(entityId: string): CacheManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CacheManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'cache_manager', value: state.value }, '[CacheManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'cache_manager' }, '[CacheManager] Reset');
  }

  getState(entityId: string): CacheManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CacheManagerState> {
    return this.states;
  }
}

export const cacheManager = new CacheManager();
export default cacheManager;
