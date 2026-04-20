import { logger } from '../lib/logger.js';

/**
 * ENTROPY_MANAGER — Module #341
 * Entropy tracking and management
 * Kategori: MESIN & SISTEM
 */
export interface EntropyManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EntropyManager {
  private states: Map<string, EntropyManagerState> = new Map();

  private getOrCreate(entityId: string): EntropyManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EntropyManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'entropy_manager', value: state.value }, '[EntropyManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'entropy_manager' }, '[EntropyManager] Reset');
  }

  getState(entityId: string): EntropyManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EntropyManagerState> {
    return this.states;
  }
}

export const entropyManager = new EntropyManager();
export default entropyManager;
