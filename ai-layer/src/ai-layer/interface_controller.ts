import { logger } from '../lib/logger.js';

/**
 * INTERFACE_CONTROLLER — Module #377
 * System interface control layer
 * Kategori: MESIN & SISTEM
 */
export interface InterfaceControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InterfaceController {
  private states: Map<string, InterfaceControllerState> = new Map();

  private getOrCreate(entityId: string): InterfaceControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InterfaceControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'interface_controller', value: state.value }, '[InterfaceController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'interface_controller' }, '[InterfaceController] Reset');
  }

  getState(entityId: string): InterfaceControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InterfaceControllerState> {
    return this.states;
  }
}

export const interfaceController = new InterfaceController();
export default interfaceController;
