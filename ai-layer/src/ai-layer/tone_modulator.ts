import { logger } from '../lib/logger.js';

/**
 * TONE_MODULATOR — Module #605
 * Speech tone modulation
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ToneModulatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ToneModulator {
  private states: Map<string, ToneModulatorState> = new Map();

  private getOrCreate(entityId: string): ToneModulatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ToneModulatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'tone_modulator', value: state.value }, '[ToneModulator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'tone_modulator' }, '[ToneModulator] Reset');
  }

  getState(entityId: string): ToneModulatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ToneModulatorState> {
    return this.states;
  }
}

export const toneModulator = new ToneModulator();
export default toneModulator;
