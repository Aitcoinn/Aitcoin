import { logger } from '../lib/logger.js';

/**
 * POWER_NETWORK — Module #586
 * Power distribution network
 * Kategori: JARINGAN & KONEKSI
 */
export interface PowerNetworkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PowerNetwork {
  private states: Map<string, PowerNetworkState> = new Map();

  private getOrCreate(entityId: string): PowerNetworkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PowerNetworkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'power_network', value: state.value }, '[PowerNetwork] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'power_network' }, '[PowerNetwork] Reset');
  }

  getState(entityId: string): PowerNetworkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PowerNetworkState> {
    return this.states;
  }
}

export const powerNetwork = new PowerNetwork();
export default powerNetwork;
