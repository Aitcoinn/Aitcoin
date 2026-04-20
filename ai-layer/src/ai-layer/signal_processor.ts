import { logger } from '../lib/logger.js';

/**
 * SIGNAL_PROCESSOR — Module #307
 * Processes signals and triggers
 * Kategori: MESIN & SISTEM
 */
export interface SignalProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SignalProcessor {
  private states: Map<string, SignalProcessorState> = new Map();

  private getOrCreate(entityId: string): SignalProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SignalProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'signal_processor', value: state.value }, '[SignalProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'signal_processor' }, '[SignalProcessor] Reset');
  }

  getState(entityId: string): SignalProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SignalProcessorState> {
    return this.states;
  }
}

export const signalProcessor = new SignalProcessor();
export default signalProcessor;
