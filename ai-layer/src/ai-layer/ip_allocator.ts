import { logger } from '../lib/logger.js';

/**
 * IP_ALLOCATOR — Module #573
 * IP address allocation
 * Kategori: JARINGAN & KONEKSI
 */
export interface IPAllocatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IPAllocator {
  private states: Map<string, IPAllocatorState> = new Map();

  private getOrCreate(entityId: string): IPAllocatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IPAllocatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ip_allocator', value: state.value }, '[IPAllocator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ip_allocator' }, '[IPAllocator] Reset');
  }

  getState(entityId: string): IPAllocatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IPAllocatorState> {
    return this.states;
  }
}

export const ipAllocator = new IPAllocator();
export default ipAllocator;
