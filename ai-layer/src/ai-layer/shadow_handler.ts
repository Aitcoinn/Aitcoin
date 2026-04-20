import { logger } from '../lib/logger.js';

/**
 * SHADOW_HANDLER — Module #717
 * Shadow detection and handling
 * Kategori: PERSEPSI & REALITAS
 */
export interface ShadowHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ShadowHandler {
  private states: Map<string, ShadowHandlerState> = new Map();

  private getOrCreate(entityId: string): ShadowHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ShadowHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'shadow_handler', value: state.value }, '[ShadowHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'shadow_handler' }, '[ShadowHandler] Reset');
  }

  getState(entityId: string): ShadowHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ShadowHandlerState> {
    return this.states;
  }
}

export const shadowHandler = new ShadowHandler();
export default shadowHandler;
