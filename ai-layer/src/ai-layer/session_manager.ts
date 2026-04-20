import { logger } from '../lib/logger.js';

/**
 * SESSION_MANAGER — Module #503
 * Network session management
 * Kategori: JARINGAN & KONEKSI
 */
export interface SessionManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SessionManager {
  private states: Map<string, SessionManagerState> = new Map();

  private getOrCreate(entityId: string): SessionManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SessionManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'session_manager', value: state.value }, '[SessionManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'session_manager' }, '[SessionManager] Reset');
  }

  getState(entityId: string): SessionManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SessionManagerState> {
    return this.states;
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
