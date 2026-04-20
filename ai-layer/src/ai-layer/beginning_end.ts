import { logger } from '../lib/logger.js';

/**
 * BEGINNING_END — Module #976
 * Beginning and end cycle
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface BeginningEndState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BeginningEnd {
  private states: Map<string, BeginningEndState> = new Map();

  private getOrCreate(entityId: string): BeginningEndState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BeginningEndState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'beginning_end', value: state.value }, '[BeginningEnd] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'beginning_end' }, '[BeginningEnd] Reset');
  }

  getState(entityId: string): BeginningEndState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BeginningEndState> {
    return this.states;
  }
}

export const beginningEnd = new BeginningEnd();
export default beginningEnd;
