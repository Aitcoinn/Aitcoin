import { logger } from '../lib/logger.js';

/**
 * OPINION_COLLECTOR — Module #684
 * Opinion collection system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface OpinionCollectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OpinionCollector {
  private states: Map<string, OpinionCollectorState> = new Map();

  private getOrCreate(entityId: string): OpinionCollectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OpinionCollectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'opinion_collector', value: state.value }, '[OpinionCollector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'opinion_collector' }, '[OpinionCollector] Reset');
  }

  getState(entityId: string): OpinionCollectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OpinionCollectorState> {
    return this.states;
  }
}

export const opinionCollector = new OpinionCollector();
export default opinionCollector;
