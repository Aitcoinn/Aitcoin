import { logger } from '../lib/logger.js';

/**
 * INPUT_PROCESSOR — Module #702
 * Input processing and normalization
 * Kategori: PERSEPSI & REALITAS
 */
export interface InputProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InputProcessor {
  private states: Map<string, InputProcessorState> = new Map();

  private getOrCreate(entityId: string): InputProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InputProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'input_processor', value: state.value }, '[InputProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'input_processor' }, '[InputProcessor] Reset');
  }

  getState(entityId: string): InputProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InputProcessorState> {
    return this.states;
  }
}

export const inputProcessor = new InputProcessor();
export default inputProcessor;
