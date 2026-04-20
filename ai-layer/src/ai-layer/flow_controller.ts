import { logger } from '../lib/logger.js';

/**
 * FLOW_CONTROLLER — Module #353
 * Information flow control
 * Kategori: MESIN & SISTEM
 */
export interface FlowControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FlowController {
  private states: Map<string, FlowControllerState> = new Map();

  private getOrCreate(entityId: string): FlowControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FlowControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'flow_controller', value: state.value }, '[FlowController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'flow_controller' }, '[FlowController] Reset');
  }

  getState(entityId: string): FlowControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FlowControllerState> {
    return this.states;
  }
}

export const flowController = new FlowController();
export default flowController;
