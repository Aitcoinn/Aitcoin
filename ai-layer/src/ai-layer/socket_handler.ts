import { logger } from '../lib/logger.js';

/**
 * SOCKET_HANDLER — Module #504
 * Socket connection handler
 * Kategori: JARINGAN & KONEKSI
 */
export interface SocketHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SocketHandler {
  private states: Map<string, SocketHandlerState> = new Map();

  private getOrCreate(entityId: string): SocketHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SocketHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'socket_handler', value: state.value }, '[SocketHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'socket_handler' }, '[SocketHandler] Reset');
  }

  getState(entityId: string): SocketHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SocketHandlerState> {
    return this.states;
  }
}

export const socketHandler = new SocketHandler();
export default socketHandler;
