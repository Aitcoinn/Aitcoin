import { logger } from '../lib/logger.js';

/**
 * LIGHT_DETECTOR — Module #716
 * Light detection and analysis
 * Kategori: PERSEPSI & REALITAS
 */
export interface LightDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LightDetector {
  private states: Map<string, LightDetectorState> = new Map();

  private getOrCreate(entityId: string): LightDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LightDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'light_detector', value: state.value }, '[LightDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'light_detector' }, '[LightDetector] Reset');
  }

  getState(entityId: string): LightDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LightDetectorState> {
    return this.states;
  }
}

export const lightDetector = new LightDetector();
export default lightDetector;
