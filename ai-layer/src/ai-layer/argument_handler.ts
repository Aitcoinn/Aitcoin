import { logger } from '../lib/logger.js';

/**
 * ARGUMENT_HANDLER — Module #853
 * Argument management system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ArgumentHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ArgumentHandler {
  private states: Map<string, ArgumentHandlerState> = new Map();

  private getOrCreate(entityId: string): ArgumentHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ArgumentHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'argument_handler', value: state.value }, '[ArgumentHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'argument_handler' }, '[ArgumentHandler] Reset');
  }

  getState(entityId: string): ArgumentHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ArgumentHandlerState> {
    return this.states;
  }
}

export const argumentHandler = new ArgumentHandler();
export default argumentHandler;
