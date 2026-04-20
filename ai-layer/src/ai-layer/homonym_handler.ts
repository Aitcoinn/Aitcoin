import { logger } from '../lib/logger.js';

/**
 * HOMONYM_HANDLER — Module #657
 * Homonym disambiguation
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface HomonymHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HomonymHandler {
  private states: Map<string, HomonymHandlerState> = new Map();

  private getOrCreate(entityId: string): HomonymHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HomonymHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'homonym_handler', value: state.value }, '[HomonymHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'homonym_handler' }, '[HomonymHandler] Reset');
  }

  getState(entityId: string): HomonymHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HomonymHandlerState> {
    return this.states;
  }
}

export const homonymHandler = new HomonymHandler();
export default homonymHandler;
