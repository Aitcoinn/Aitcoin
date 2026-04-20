import { logger } from '../lib/logger.js';

/**
 * LOGIC_PROCESSOR — Module #311
 * Handles logical operations and inference
 * Kategori: MESIN & SISTEM
 */
export interface LogicProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LogicProcessor {
  private states: Map<string, LogicProcessorState> = new Map();

  private getOrCreate(entityId: string): LogicProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LogicProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'logic_processor', value: state.value }, '[LogicProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'logic_processor' }, '[LogicProcessor] Reset');
  }

  getState(entityId: string): LogicProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LogicProcessorState> {
    return this.states;
  }
}

export const logicProcessor = new LogicProcessor();
export default logicProcessor;
