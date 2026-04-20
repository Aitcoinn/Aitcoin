import { logger } from '../lib/logger.js';

/**
 * PRESSURE_DETECTOR — Module #795
 * Pressure detection system
 * Kategori: PERSEPSI & REALITAS
 */
export interface PressureDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PressureDetector {
  private states: Map<string, PressureDetectorState> = new Map();

  private getOrCreate(entityId: string): PressureDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PressureDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'pressure_detector', value: state.value }, '[PressureDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'pressure_detector' }, '[PressureDetector] Reset');
  }

  getState(entityId: string): PressureDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PressureDetectorState> {
    return this.states;
  }
}

export const pressureDetector = new PressureDetector();
export default pressureDetector;
