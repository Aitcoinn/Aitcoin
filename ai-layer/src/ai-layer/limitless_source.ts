import { logger } from '../lib/logger.js';

/**
 * LIMITLESS_SOURCE — Module #915
 * Limitless energy source
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface LimitlessSourceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LimitlessSource {
  private states: Map<string, LimitlessSourceState> = new Map();

  private getOrCreate(entityId: string): LimitlessSourceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LimitlessSourceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'limitless_source', value: state.value }, '[LimitlessSource] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'limitless_source' }, '[LimitlessSource] Reset');
  }

  getState(entityId: string): LimitlessSourceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LimitlessSourceState> {
    return this.states;
  }
}

export const limitlessSource = new LimitlessSource();
export default limitlessSource;
