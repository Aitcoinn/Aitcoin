import { logger } from '../lib/logger.js';

/**
 * FAST_FORWARD — Module #738
 * Time acceleration system
 * Kategori: PERSEPSI & REALITAS
 */
export interface FastForwardState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FastForward {
  private states: Map<string, FastForwardState> = new Map();

  private getOrCreate(entityId: string): FastForwardState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FastForwardState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'fast_forward', value: state.value }, '[FastForward] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'fast_forward' }, '[FastForward] Reset');
  }

  getState(entityId: string): FastForwardState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FastForwardState> {
    return this.states;
  }
}

export const fastForward = new FastForward();
export default fastForward;
