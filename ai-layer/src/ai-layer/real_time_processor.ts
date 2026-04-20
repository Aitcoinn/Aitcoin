import { logger } from '../lib/logger.js';

/**
 * REAL_TIME_PROCESSOR — Module #366
 * Real-time data processing
 * Kategori: MESIN & SISTEM
 */
export interface RealTimeProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RealTimeProcessor {
  private states: Map<string, RealTimeProcessorState> = new Map();

  private getOrCreate(entityId: string): RealTimeProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RealTimeProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'real_time_processor', value: state.value }, '[RealTimeProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'real_time_processor' }, '[RealTimeProcessor] Reset');
  }

  getState(entityId: string): RealTimeProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RealTimeProcessorState> {
    return this.states;
  }
}

export const realTimeProcessor = new RealTimeProcessor();
export default realTimeProcessor;
