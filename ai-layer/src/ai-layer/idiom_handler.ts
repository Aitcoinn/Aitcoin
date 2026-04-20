import { logger } from '../lib/logger.js';

/**
 * IDIOM_HANDLER — Module #614
 * Idiom recognition and usage
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface IdiomHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IdiomHandler {
  private states: Map<string, IdiomHandlerState> = new Map();

  private getOrCreate(entityId: string): IdiomHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IdiomHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'idiom_handler', value: state.value }, '[IdiomHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'idiom_handler' }, '[IdiomHandler] Reset');
  }

  getState(entityId: string): IdiomHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IdiomHandlerState> {
    return this.states;
  }
}

export const idiomHandler = new IdiomHandler();
export default idiomHandler;
