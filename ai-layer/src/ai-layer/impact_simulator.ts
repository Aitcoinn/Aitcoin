import { logger } from '../lib/logger.js';

/**
 * IMPACT_SIMULATOR — Module #797
 * Impact simulation system
 * Kategori: PERSEPSI & REALITAS
 */
export interface ImpactSimulatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ImpactSimulator {
  private states: Map<string, ImpactSimulatorState> = new Map();

  private getOrCreate(entityId: string): ImpactSimulatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ImpactSimulatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'impact_simulator', value: state.value }, '[ImpactSimulator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'impact_simulator' }, '[ImpactSimulator] Reset');
  }

  getState(entityId: string): ImpactSimulatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ImpactSimulatorState> {
    return this.states;
  }
}

export const impactSimulator = new ImpactSimulator();
export default impactSimulator;
