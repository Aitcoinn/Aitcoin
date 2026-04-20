import { logger } from '../lib/logger.js';

/**
 * MEMORY_SHARE — Module #693
 * Memory sharing engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface MemoryShareState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MemoryShare {
  private states: Map<string, MemoryShareState> = new Map();

  private getOrCreate(entityId: string): MemoryShareState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MemoryShareState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'memory_share', value: state.value }, '[MemoryShare] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'memory_share' }, '[MemoryShare] Reset');
  }

  getState(entityId: string): MemoryShareState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MemoryShareState> {
    return this.states;
  }
}

export const memoryShare = new MemoryShare();
export default memoryShare;
