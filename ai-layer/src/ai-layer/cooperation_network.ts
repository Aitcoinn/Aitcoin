import { logger } from '../lib/logger.js';

/**
 * COOPERATION_NETWORK — Module #885
 * Cooperation network system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CooperationNetworkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CooperationNetwork {
  private states: Map<string, CooperationNetworkState> = new Map();

  private getOrCreate(entityId: string): CooperationNetworkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CooperationNetworkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'cooperation_network', value: state.value }, '[CooperationNetwork] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'cooperation_network' }, '[CooperationNetwork] Reset');
  }

  getState(entityId: string): CooperationNetworkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CooperationNetworkState> {
    return this.states;
  }
}

export const cooperationNetwork = new CooperationNetwork();
export default cooperationNetwork;
