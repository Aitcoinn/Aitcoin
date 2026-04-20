import { logger } from '../lib/logger.js';

/**
 * SIMULATION_CORE — Module #729
 * Core simulation engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface SimulationCoreState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SimulationCore {
  private states: Map<string, SimulationCoreState> = new Map();

  private getOrCreate(entityId: string): SimulationCoreState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SimulationCoreState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'simulation_core', value: state.value }, '[SimulationCore] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'simulation_core' }, '[SimulationCore] Reset');
  }

  getState(entityId: string): SimulationCoreState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SimulationCoreState> {
    return this.states;
  }
}

export const simulationCore = new SimulationCore();
export default simulationCore;
