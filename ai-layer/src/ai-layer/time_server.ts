import { logger } from '../lib/logger.js';

/**
 * TIME_SERVER — Module #546
 * Network time server
 * Kategori: JARINGAN & KONEKSI
 */
export interface TimeServerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TimeServer {
  private states: Map<string, TimeServerState> = new Map();

  private getOrCreate(entityId: string): TimeServerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TimeServerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'time_server', value: state.value }, '[TimeServer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'time_server' }, '[TimeServer] Reset');
  }

  getState(entityId: string): TimeServerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TimeServerState> {
    return this.states;
  }
}

export const timeServer = new TimeServer();
export default timeServer;
