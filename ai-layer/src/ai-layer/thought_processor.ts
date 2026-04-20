import { logger } from '../lib/logger.js';

/**
 * THOUGHT_PROCESSOR — Module #305
 * Processes thoughts and reasoning chains
 * Kategori: MESIN & SISTEM
 */
export interface ThoughtProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ThoughtProcessor {
  private states: Map<string, ThoughtProcessorState> = new Map();

  private getOrCreate(entityId: string): ThoughtProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ThoughtProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'thought_processor', value: state.value }, '[ThoughtProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'thought_processor' }, '[ThoughtProcessor] Reset');
  }

  getState(entityId: string): ThoughtProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ThoughtProcessorState> {
    return this.states;
  }
}

export const thoughtProcessor = new ThoughtProcessor();
export default thoughtProcessor;
