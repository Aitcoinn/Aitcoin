import { logger } from '../lib/logger.js';

/**
 * NOISE_GENERATOR — Module #340
 * Procedural noise generation
 * Kategori: MESIN & SISTEM
 */
export interface NoiseGeneratorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NoiseGenerator {
  private states: Map<string, NoiseGeneratorState> = new Map();

  private getOrCreate(entityId: string): NoiseGeneratorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NoiseGeneratorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'noise_generator', value: state.value }, '[NoiseGenerator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'noise_generator' }, '[NoiseGenerator] Reset');
  }

  getState(entityId: string): NoiseGeneratorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NoiseGeneratorState> {
    return this.states;
  }
}

export const noiseGenerator = new NoiseGenerator();
export default noiseGenerator;
