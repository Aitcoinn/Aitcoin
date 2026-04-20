import { logger } from '../lib/logger.js';

/**
 * TIME_FLOW — Module #734
 * Time flow management
 * Kategori: PERSEPSI & REALITAS
 */
export interface TimeFlowState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TimeFlow {
  private states: Map<string, TimeFlowState> = new Map();

  private getOrCreate(entityId: string): TimeFlowState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TimeFlowState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'time_flow', value: state.value }, '[TimeFlow] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'time_flow' }, '[TimeFlow] Reset');
  }

  getState(entityId: string): TimeFlowState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TimeFlowState> {
    return this.states;
  }
}

export const timeFlow = new TimeFlow();
export default timeFlow;
