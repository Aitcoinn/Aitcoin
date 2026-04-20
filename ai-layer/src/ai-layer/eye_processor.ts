import { logger } from '../lib/logger.js';

/**
 * EYE_PROCESSOR — Module #705
 * Visual input processing
 * Kategori: PERSEPSI & REALITAS
 */
export interface EyeProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EyeProcessor {
  private states: Map<string, EyeProcessorState> = new Map();

  private getOrCreate(entityId: string): EyeProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EyeProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'eye_processor', value: state.value }, '[EyeProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'eye_processor' }, '[EyeProcessor] Reset');
  }

  getState(entityId: string): EyeProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EyeProcessorState> {
    return this.states;
  }
}

export const eyeProcessor = new EyeProcessor();
export default eyeProcessor;
