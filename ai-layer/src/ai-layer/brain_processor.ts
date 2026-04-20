import { logger } from '../lib/logger.js';

/**
 * BRAIN_PROCESSOR — Module #304
 * Brain-like processing and cognition
 * Kategori: MESIN & SISTEM
 */
export interface BrainProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BrainProcessor {
  private states: Map<string, BrainProcessorState> = new Map();

  private getOrCreate(entityId: string): BrainProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BrainProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'brain_processor', value: state.value }, '[BrainProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'brain_processor' }, '[BrainProcessor] Reset');
  }

  getState(entityId: string): BrainProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BrainProcessorState> {
    return this.states;
  }
}

export const brainProcessor = new BrainProcessor();
export default brainProcessor;
