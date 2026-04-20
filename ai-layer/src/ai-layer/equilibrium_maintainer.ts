import { logger } from '../lib/logger.js';

/**
 * EQUILIBRIUM_MAINTAINER — Module #363
 * Equilibrium state maintenance
 * Kategori: MESIN & SISTEM
 */
export interface EquilibriumMaintainerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EquilibriumMaintainer {
  private states: Map<string, EquilibriumMaintainerState> = new Map();

  private getOrCreate(entityId: string): EquilibriumMaintainerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EquilibriumMaintainerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'equilibrium_maintainer', value: state.value }, '[EquilibriumMaintainer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'equilibrium_maintainer' }, '[EquilibriumMaintainer] Reset');
  }

  getState(entityId: string): EquilibriumMaintainerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EquilibriumMaintainerState> {
    return this.states;
  }
}

export const equilibriumMaintainer = new EquilibriumMaintainer();
export default equilibriumMaintainer;
