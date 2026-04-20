import { logger } from '../lib/logger.js';

/**
 * PANIC_BUTTON — Module #481
 * Emergency shutdown trigger
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface PanicButtonState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PanicButton {
  private states: Map<string, PanicButtonState> = new Map();

  private getOrCreate(entityId: string): PanicButtonState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PanicButtonState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'panic_button', value: state.value }, '[PanicButton] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'panic_button' }, '[PanicButton] Reset');
  }

  getState(entityId: string): PanicButtonState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PanicButtonState> {
    return this.states;
  }
}

export const panicButton = new PanicButton();
export default panicButton;
