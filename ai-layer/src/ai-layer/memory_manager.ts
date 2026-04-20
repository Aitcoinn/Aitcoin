import { logger } from '../lib/logger.js';

/**
 * MEMORY_MANAGER — Module #372
 * Memory allocation and management
 * Kategori: MESIN & SISTEM
 */
export interface MemoryManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MemoryManager {
  private states: Map<string, MemoryManagerState> = new Map();

  private getOrCreate(entityId: string): MemoryManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MemoryManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'memory_manager', value: state.value }, '[MemoryManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'memory_manager' }, '[MemoryManager] Reset');
  }

  getState(entityId: string): MemoryManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MemoryManagerState> {
    return this.states;
  }
}

export const memoryManager = new MemoryManager();
export default memoryManager;
