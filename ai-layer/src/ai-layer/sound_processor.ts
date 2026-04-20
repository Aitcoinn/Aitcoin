import { logger } from '../lib/logger.js';

/**
 * SOUND_PROCESSOR — Module #309
 * Processes audio and sound signals
 * Kategori: MESIN & SISTEM
 */
export interface SoundProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SoundProcessor {
  private states: Map<string, SoundProcessorState> = new Map();

  private getOrCreate(entityId: string): SoundProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SoundProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sound_processor', value: state.value }, '[SoundProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sound_processor' }, '[SoundProcessor] Reset');
  }

  getState(entityId: string): SoundProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SoundProcessorState> {
    return this.states;
  }
}

export const soundProcessor = new SoundProcessor();
export default soundProcessor;
