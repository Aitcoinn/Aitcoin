import { logger } from '../lib/logger.js';

/**
 * ENDLESS_LOOP — Module #972
 * Infinite loop management
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface EndlessLoopState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EndlessLoop {
  private states: Map<string, EndlessLoopState> = new Map();

  private getOrCreate(entityId: string): EndlessLoopState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EndlessLoopState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'endless_loop', value: state.value }, '[EndlessLoop] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'endless_loop' }, '[EndlessLoop] Reset');
  }

  getState(entityId: string): EndlessLoopState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EndlessLoopState> {
    return this.states;
  }
}

export const endlessLoop = new EndlessLoop();
export default endlessLoop;
