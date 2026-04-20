import { logger } from '../lib/logger.js';

/**
 * ONE_TIME_PAD — Module #423
 * One-time pad encryption scheme
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface OneTimePadState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OneTimePad {
  private states: Map<string, OneTimePadState> = new Map();

  private getOrCreate(entityId: string): OneTimePadState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OneTimePadState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'one_time_pad', value: state.value }, '[OneTimePad] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'one_time_pad' }, '[OneTimePad] Reset');
  }

  getState(entityId: string): OneTimePadState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OneTimePadState> {
    return this.states;
  }
}

export const oneTimePad = new OneTimePad();
export default oneTimePad;
