import { logger } from '../lib/logger.js';

/**
 * DANGER_DETECTOR — Module #877
 * Danger detection system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface DangerDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DangerDetector {
  private states: Map<string, DangerDetectorState> = new Map();

  private getOrCreate(entityId: string): DangerDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DangerDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'danger_detector', value: state.value }, '[DangerDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'danger_detector' }, '[DangerDetector] Reset');
  }

  getState(entityId: string): DangerDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DangerDetectorState> {
    return this.states;
  }
}

export const dangerDetector = new DangerDetector();
export default dangerDetector;
