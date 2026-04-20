import { logger } from '../lib/logger.js';

/**
 * RESOURCE_ALLOCATOR — Module #350
 * Dynamic resource allocation system
 * Kategori: MESIN & SISTEM
 */
export interface ResourceAllocatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ResourceAllocator {
  private states: Map<string, ResourceAllocatorState> = new Map();

  private getOrCreate(entityId: string): ResourceAllocatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ResourceAllocatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'resource_allocator', value: state.value }, '[ResourceAllocator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'resource_allocator' }, '[ResourceAllocator] Reset');
  }

  getState(entityId: string): ResourceAllocatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ResourceAllocatorState> {
    return this.states;
  }
}

export const resourceAllocator = new ResourceAllocator();
export default resourceAllocator;
