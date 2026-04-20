import { logger } from '../lib/logger.js';

/**
 * FORM_CHANGER — Module #928
 * Form change system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface FormChangerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FormChanger {
  private states: Map<string, FormChangerState> = new Map();

  private getOrCreate(entityId: string): FormChangerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FormChangerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'form_changer', value: state.value }, '[FormChanger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'form_changer' }, '[FormChanger] Reset');
  }

  getState(entityId: string): FormChangerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FormChangerState> {
    return this.states;
  }
}

export const formChanger = new FormChanger();
export default formChanger;
