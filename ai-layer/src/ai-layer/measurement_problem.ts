import { logger } from '../lib/logger.js';

/**
 * MEASUREMENT_PROBLEM — Module #784
 * Quantum measurement problem
 * Kategori: PERSEPSI & REALITAS
 */
export interface MeasurementProblemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MeasurementProblem {
  private states: Map<string, MeasurementProblemState> = new Map();

  private getOrCreate(entityId: string): MeasurementProblemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MeasurementProblemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'measurement_problem', value: state.value }, '[MeasurementProblem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'measurement_problem' }, '[MeasurementProblem] Reset');
  }

  getState(entityId: string): MeasurementProblemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MeasurementProblemState> {
    return this.states;
  }
}

export const measurementProblem = new MeasurementProblem();
export default measurementProblem;
