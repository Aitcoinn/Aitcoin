import { logger } from '../lib/logger.js';

/**
 * DATA_PROCESSOR — Module #306
 * Processes and transforms data streams
 * Kategori: MESIN & SISTEM
 */
export interface DataProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DataProcessor {
  private states: Map<string, DataProcessorState> = new Map();

  private getOrCreate(entityId: string): DataProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DataProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'data_processor', value: state.value }, '[DataProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'data_processor' }, '[DataProcessor] Reset');
  }

  getState(entityId: string): DataProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DataProcessorState> {
    return this.states;
  }
}

export const dataProcessor = new DataProcessor();
export default dataProcessor;
