import { logger } from '../lib/logger.js';

/**
 * KARMA_ENGINE — Module #773
 * Karma calculation engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface KarmaEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class KarmaEngine {
  private states: Map<string, KarmaEngineState> = new Map();

  private getOrCreate(entityId: string): KarmaEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): KarmaEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'karma_engine', value: state.value }, '[KarmaEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'karma_engine' }, '[KarmaEngine] Reset');
  }

  getState(entityId: string): KarmaEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, KarmaEngineState> {
    return this.states;
  }
}

export const karmaEngine = new KarmaEngine();
export default karmaEngine;
