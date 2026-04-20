import { logger } from '../lib/logger.js';

/**
 * INTENT_RECOGNIZER — Module #671
 * Intent recognition system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface IntentRecognizerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IntentRecognizer {
  private states: Map<string, IntentRecognizerState> = new Map();

  private getOrCreate(entityId: string): IntentRecognizerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IntentRecognizerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'intent_recognizer', value: state.value }, '[IntentRecognizer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'intent_recognizer' }, '[IntentRecognizer] Reset');
  }

  getState(entityId: string): IntentRecognizerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IntentRecognizerState> {
    return this.states;
  }
}

export const intentRecognizer = new IntentRecognizer();
export default intentRecognizer;
