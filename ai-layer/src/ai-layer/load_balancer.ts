import { logger } from '../lib/logger.js';

/**
 * LOAD_BALANCER — Module #351
 * Load distribution and balancing
 * Kategori: MESIN & SISTEM
 */
export interface LoadBalancerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LoadBalancer {
  private states: Map<string, LoadBalancerState> = new Map();

  private getOrCreate(entityId: string): LoadBalancerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LoadBalancerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'load_balancer', value: state.value }, '[LoadBalancer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'load_balancer' }, '[LoadBalancer] Reset');
  }

  getState(entityId: string): LoadBalancerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LoadBalancerState> {
    return this.states;
  }
}

export const loadBalancer = new LoadBalancer();
export default loadBalancer;
