import { logger } from '../lib/logger.js';

/**
 * AURA_DETECTOR — Module #754
 * Aura detection system
 * Kategori: PERSEPSI & REALITAS
 */
export interface AuraDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AuraDetector {
  private states: Map<string, AuraDetectorState> = new Map();

  private getOrCreate(entityId: string): AuraDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AuraDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'aura_detector', value: state.value }, '[AuraDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'aura_detector' }, '[AuraDetector] Reset');
  }

  getState(entityId: string): AuraDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AuraDetectorState> {
    return this.states;
  }
}

export const auraDetector = new AuraDetector();
export default auraDetector;
