import { logger } from '../lib/logger.js';

/**
 * POLL_ENGINE — Module #686
 * Polling system engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface PollEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PollEngine {
  private states: Map<string, PollEngineState> = new Map();

  private getOrCreate(entityId: string): PollEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PollEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'poll_engine', value: state.value }, '[PollEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'poll_engine' }, '[PollEngine] Reset');
  }

  getState(entityId: string): PollEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PollEngineState> {
    return this.states;
  }
}

export const pollEngine = new PollEngine();
export default pollEngine;
