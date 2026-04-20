import { logger } from '../lib/logger.js';

/**
 * HARMONY_DETECTOR — Module #759
 * Harmony detection system
 * Kategori: PERSEPSI & REALITAS
 */
export interface HarmonyDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HarmonyDetector {
  private states: Map<string, HarmonyDetectorState> = new Map();

  private getOrCreate(entityId: string): HarmonyDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HarmonyDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'harmony_detector', value: state.value }, '[HarmonyDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'harmony_detector' }, '[HarmonyDetector] Reset');
  }

  getState(entityId: string): HarmonyDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HarmonyDetectorState> {
    return this.states;
  }
}

export const harmonyDetector = new HarmonyDetector();
export default harmonyDetector;
