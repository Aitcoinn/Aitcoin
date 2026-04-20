import { logger } from '../lib/logger.js';

/**
 * SPEECH_GENERATOR — Module #600
 * Speech generation engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface SpeechGeneratorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpeechGenerator {
  private states: Map<string, SpeechGeneratorState> = new Map();

  private getOrCreate(entityId: string): SpeechGeneratorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpeechGeneratorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'speech_generator', value: state.value }, '[SpeechGenerator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'speech_generator' }, '[SpeechGenerator] Reset');
  }

  getState(entityId: string): SpeechGeneratorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpeechGeneratorState> {
    return this.states;
  }
}

export const speechGenerator = new SpeechGenerator();
export default speechGenerator;
