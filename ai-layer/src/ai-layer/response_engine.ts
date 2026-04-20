import { logger } from '../lib/logger.js';

/**
 * RESPONSE_ENGINE — Module #327
 * Response generation and management
 * Kategori: MESIN & SISTEM
 */
export interface ResponseEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ResponseEngine {
  private states: Map<string, ResponseEngineState> = new Map();

  private getOrCreate(entityId: string): ResponseEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ResponseEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'response_engine', value: state.value }, '[ResponseEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'response_engine' }, '[ResponseEngine] Reset');
  }

  getState(entityId: string): ResponseEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ResponseEngineState> {
    return this.states;
  }
}

export const responseEngine = new ResponseEngine();
export default responseEngine;
