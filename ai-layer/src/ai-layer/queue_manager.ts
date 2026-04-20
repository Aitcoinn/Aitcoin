import { logger } from '../lib/logger.js';

/**
 * QUEUE_MANAGER — Module #368
 * Priority queue management
 * Kategori: MESIN & SISTEM
 */
export interface QueueManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class QueueManager {
  private states: Map<string, QueueManagerState> = new Map();

  private getOrCreate(entityId: string): QueueManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): QueueManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'queue_manager', value: state.value }, '[QueueManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'queue_manager' }, '[QueueManager] Reset');
  }

  getState(entityId: string): QueueManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, QueueManagerState> {
    return this.states;
  }
}

export const queueManager = new QueueManager();
export default queueManager;
