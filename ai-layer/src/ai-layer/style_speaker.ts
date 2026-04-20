import { logger } from '../lib/logger.js';

/**
 * STYLE_SPEAKER — Module #610
 * Speaking style management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface StyleSpeakerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StyleSpeaker {
  private states: Map<string, StyleSpeakerState> = new Map();

  private getOrCreate(entityId: string): StyleSpeakerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StyleSpeakerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'style_speaker', value: state.value }, '[StyleSpeaker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'style_speaker' }, '[StyleSpeaker] Reset');
  }

  getState(entityId: string): StyleSpeakerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StyleSpeakerState> {
    return this.states;
  }
}

export const styleSpeaker = new StyleSpeaker();
export default styleSpeaker;
