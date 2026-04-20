import { logger } from '../lib/logger.js';

/**
 * WAVE_FUNCTION — Module #778
 * Quantum wave function
 * Kategori: PERSEPSI & REALITAS
 */
export interface WaveFunctionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WaveFunction {
  private states: Map<string, WaveFunctionState> = new Map();

  private getOrCreate(entityId: string): WaveFunctionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WaveFunctionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'wave_function', value: state.value }, '[WaveFunction] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'wave_function' }, '[WaveFunction] Reset');
  }

  getState(entityId: string): WaveFunctionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WaveFunctionState> {
    return this.states;
  }
}

export const waveFunction = new WaveFunction();
export default waveFunction;
