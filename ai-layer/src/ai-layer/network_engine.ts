import { logger } from '../lib/logger.js';

/**
 * NETWORK_ENGINE — Module #332
 * Network topology and routing engine
 * Kategori: MESIN & SISTEM
 */
export interface NetworkEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NetworkEngine {
  private states: Map<string, NetworkEngineState> = new Map();

  private getOrCreate(entityId: string): NetworkEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NetworkEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'network_engine', value: state.value }, '[NetworkEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'network_engine' }, '[NetworkEngine] Reset');
  }

  getState(entityId: string): NetworkEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NetworkEngineState> {
    return this.states;
  }
}

export const networkEngine = new NetworkEngine();
export default networkEngine;
