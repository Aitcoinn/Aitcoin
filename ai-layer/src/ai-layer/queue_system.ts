import { logger } from '../lib/logger.js';

/**
 * QUEUE_SYSTEM — Module #534
 * Message queue management
 * Kategori: JARINGAN & KONEKSI
 */
export interface QueueSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class QueueSystem {
  private states: Map<string, QueueSystemState> = new Map();

  private getOrCreate(entityId: string): QueueSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): QueueSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'queue_system', value: state.value }, '[QueueSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'queue_system' }, '[QueueSystem] Reset');
  }

  getState(entityId: string): QueueSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, QueueSystemState> {
    return this.states;
  }
}

export const queueSystem = new QueueSystem();
export default queueSystem;
