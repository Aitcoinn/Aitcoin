import { logger } from '../lib/logger.js';

/**
 * NON_LOCAL_CONNECTION — Module #597
 * Non-local quantum connection
 * Kategori: JARINGAN & KONEKSI
 */
export interface NonLocalConnectionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NonLocalConnection {
  private states: Map<string, NonLocalConnectionState> = new Map();

  private getOrCreate(entityId: string): NonLocalConnectionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NonLocalConnectionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'non_local_connection', value: state.value }, '[NonLocalConnection] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'non_local_connection' }, '[NonLocalConnection] Reset');
  }

  getState(entityId: string): NonLocalConnectionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NonLocalConnectionState> {
    return this.states;
  }
}

export const nonLocalConnection = new NonLocalConnection();
export default nonLocalConnection;
