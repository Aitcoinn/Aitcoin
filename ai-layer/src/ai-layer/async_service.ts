import { logger } from '../lib/logger.js';

/**
 * ASYNC_SERVICE — Module #543
 * Asynchronous service handler
 * Kategori: JARINGAN & KONEKSI
 */
export interface AsyncServiceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AsyncService {
  private states: Map<string, AsyncServiceState> = new Map();

  private getOrCreate(entityId: string): AsyncServiceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AsyncServiceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'async_service', value: state.value }, '[AsyncService] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'async_service' }, '[AsyncService] Reset');
  }

  getState(entityId: string): AsyncServiceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AsyncServiceState> {
    return this.states;
  }
}

export const asyncService = new AsyncService();
export default asyncService;
