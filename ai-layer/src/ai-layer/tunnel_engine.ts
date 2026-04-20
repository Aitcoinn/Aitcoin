import { logger } from '../lib/logger.js';

/**
 * TUNNEL_ENGINE — Module #567
 * Network tunneling engine
 * Kategori: JARINGAN & KONEKSI
 */
export interface TunnelEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TunnelEngine {
  private states: Map<string, TunnelEngineState> = new Map();

  private getOrCreate(entityId: string): TunnelEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TunnelEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'tunnel_engine', value: state.value }, '[TunnelEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'tunnel_engine' }, '[TunnelEngine] Reset');
  }

  getState(entityId: string): TunnelEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TunnelEngineState> {
    return this.states;
  }
}

export const tunnelEngine = new TunnelEngine();
export default tunnelEngine;
