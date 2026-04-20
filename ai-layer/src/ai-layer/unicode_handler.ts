import { logger } from '../lib/logger.js';

/**
 * UNICODE_HANDLER — Module #639
 * Unicode character handling
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface UnicodeHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UnicodeHandler {
  private states: Map<string, UnicodeHandlerState> = new Map();

  private getOrCreate(entityId: string): UnicodeHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UnicodeHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'unicode_handler', value: state.value }, '[UnicodeHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'unicode_handler' }, '[UnicodeHandler] Reset');
  }

  getState(entityId: string): UnicodeHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UnicodeHandlerState> {
    return this.states;
  }
}

export const unicodeHandler = new UnicodeHandler();
export default unicodeHandler;
