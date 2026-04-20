import { logger } from '../lib/logger.js';

/**
 * CUSTOM_HANDLER — Module #805
 * Custom and tradition handler
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CustomHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CustomHandler {
  private states: Map<string, CustomHandlerState> = new Map();

  private getOrCreate(entityId: string): CustomHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CustomHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'custom_handler', value: state.value }, '[CustomHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'custom_handler' }, '[CustomHandler] Reset');
  }

  getState(entityId: string): CustomHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CustomHandlerState> {
    return this.states;
  }
}

export const customHandler = new CustomHandler();
export default customHandler;
