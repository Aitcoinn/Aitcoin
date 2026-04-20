import { logger } from '../lib/logger.js';

/**
 * WEBSOCKET_ENGINE — Module #509
 * WebSocket real-time communication
 * Kategori: JARINGAN & KONEKSI
 */
export interface WebSocketEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WebSocketEngine {
  private states: Map<string, WebSocketEngineState> = new Map();

  private getOrCreate(entityId: string): WebSocketEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WebSocketEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'websocket_engine', value: state.value }, '[WebSocketEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'websocket_engine' }, '[WebSocketEngine] Reset');
  }

  getState(entityId: string): WebSocketEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WebSocketEngineState> {
    return this.states;
  }
}

export const websocketEngine = new WebSocketEngine();
export default websocketEngine;
