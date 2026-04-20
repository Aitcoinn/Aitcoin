import { logger } from '../lib/logger.js';

/**
 * OBJECT_DETECTOR — Module #707
 * Object detection system
 * Kategori: PERSEPSI & REALITAS
 */
export interface ObjectDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ObjectDetector {
  private states: Map<string, ObjectDetectorState> = new Map();

  private getOrCreate(entityId: string): ObjectDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ObjectDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'object_detector', value: state.value }, '[ObjectDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'object_detector' }, '[ObjectDetector] Reset');
  }

  getState(entityId: string): ObjectDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ObjectDetectorState> {
    return this.states;
  }
}

export const objectDetector = new ObjectDetector();
export default objectDetector;
