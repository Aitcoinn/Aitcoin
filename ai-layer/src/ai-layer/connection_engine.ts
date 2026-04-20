import { logger } from '../lib/logger.js';

/**
 * CONNECTION_ENGINE — Module #331
 * Connection establishment and management
 * Kategori: MESIN & SISTEM
 */
export interface ConnectionEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ConnectionEngine {
  private states: Map<string, ConnectionEngineState> = new Map();

  private getOrCreate(entityId: string): ConnectionEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ConnectionEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'connection_engine', value: state.value }, '[ConnectionEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'connection_engine' }, '[ConnectionEngine] Reset');
  }

  getState(entityId: string): ConnectionEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ConnectionEngineState> {
    return this.states;
  }
}

export const connectionEngine = new ConnectionEngine();
export default connectionEngine;
