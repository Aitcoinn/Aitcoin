import { logger } from '../lib/logger.js';

/**
 * INTRUSION_DETECTOR — Module #406
 * Intrusion detection system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface IntrusionDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IntrusionDetector {
  private states: Map<string, IntrusionDetectorState> = new Map();

  private getOrCreate(entityId: string): IntrusionDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IntrusionDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'intrusion_detector', value: state.value }, '[IntrusionDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'intrusion_detector' }, '[IntrusionDetector] Reset');
  }

  getState(entityId: string): IntrusionDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IntrusionDetectorState> {
    return this.states;
  }
}

export const intrusionDetector = new IntrusionDetector();
export default intrusionDetector;
