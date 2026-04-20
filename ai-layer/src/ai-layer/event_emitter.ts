import { logger } from '../lib/logger.js';

/**
 * EVENT_EMITTER — Module #536
 * Event emission and handling
 * Kategori: JARINGAN & KONEKSI
 */
export interface EventEmitterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EventEmitter {
  private states: Map<string, EventEmitterState> = new Map();

  private getOrCreate(entityId: string): EventEmitterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EventEmitterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'event_emitter', value: state.value }, '[EventEmitter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'event_emitter' }, '[EventEmitter] Reset');
  }

  getState(entityId: string): EventEmitterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EventEmitterState> {
    return this.states;
  }
}

export const eventEmitter = new EventEmitter();
export default eventEmitter;
