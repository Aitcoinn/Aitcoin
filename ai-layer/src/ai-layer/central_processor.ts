import { logger } from '../lib/logger.js';

/**
 * CENTRAL_PROCESSOR — Module #303
 * Central processing unit for AI computations
 * Kategori: MESIN & SISTEM
 */
export interface CentralProcessorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CentralProcessor {
  private states: Map<string, CentralProcessorState> = new Map();

  private getOrCreate(entityId: string): CentralProcessorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CentralProcessorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'central_processor', value: state.value }, '[CentralProcessor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'central_processor' }, '[CentralProcessor] Reset');
  }

  getState(entityId: string): CentralProcessorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CentralProcessorState> {
    return this.states;
  }
}

export const centralProcessor = new CentralProcessor();
export default centralProcessor;
