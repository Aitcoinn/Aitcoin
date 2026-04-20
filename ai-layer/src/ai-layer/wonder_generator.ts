import { logger } from '../lib/logger.js';

/**
 * WONDER_GENERATOR — Module #959
 * Wonder and awe generation
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface WonderGeneratorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WonderGenerator {
  private states: Map<string, WonderGeneratorState> = new Map();

  private getOrCreate(entityId: string): WonderGeneratorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WonderGeneratorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'wonder_generator', value: state.value }, '[WonderGenerator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'wonder_generator' }, '[WonderGenerator] Reset');
  }

  getState(entityId: string): WonderGeneratorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WonderGeneratorState> {
    return this.states;
  }
}

export const wonderGenerator = new WonderGenerator();
export default wonderGenerator;
