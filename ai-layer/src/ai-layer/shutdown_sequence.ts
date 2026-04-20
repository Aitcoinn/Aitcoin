import { logger } from '../lib/logger.js';

/**
 * SHUTDOWN_SEQUENCE — Module #482
 * Safe system shutdown sequence
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface ShutdownSequenceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ShutdownSequence {
  private states: Map<string, ShutdownSequenceState> = new Map();

  private getOrCreate(entityId: string): ShutdownSequenceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ShutdownSequenceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'shutdown_sequence', value: state.value }, '[ShutdownSequence] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'shutdown_sequence' }, '[ShutdownSequence] Reset');
  }

  getState(entityId: string): ShutdownSequenceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ShutdownSequenceState> {
    return this.states;
  }
}

export const shutdownSequence = new ShutdownSequence();
export default shutdownSequence;
