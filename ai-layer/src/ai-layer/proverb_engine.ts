import { logger } from '../lib/logger.js';

/**
 * PROVERB_ENGINE — Module #615
 * Proverb database and application
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ProverbEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ProverbEngine {
  private states: Map<string, ProverbEngineState> = new Map();

  private getOrCreate(entityId: string): ProverbEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ProverbEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'proverb_engine', value: state.value }, '[ProverbEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'proverb_engine' }, '[ProverbEngine] Reset');
  }

  getState(entityId: string): ProverbEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ProverbEngineState> {
    return this.states;
  }
}

export const proverbEngine = new ProverbEngine();
export default proverbEngine;
