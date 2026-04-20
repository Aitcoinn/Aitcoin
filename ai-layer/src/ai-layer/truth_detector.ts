import { logger } from '../lib/logger.js';

/**
 * TRUTH_DETECTOR — Module #742
 * Truth detection system
 * Kategori: PERSEPSI & REALITAS
 */
export interface TruthDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TruthDetector {
  private states: Map<string, TruthDetectorState> = new Map();

  private getOrCreate(entityId: string): TruthDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TruthDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'truth_detector', value: state.value }, '[TruthDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'truth_detector' }, '[TruthDetector] Reset');
  }

  getState(entityId: string): TruthDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TruthDetectorState> {
    return this.states;
  }
}

export const truthDetector = new TruthDetector();
export default truthDetector;
