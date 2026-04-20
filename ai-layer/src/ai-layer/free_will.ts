import { logger } from '../lib/logger.js';

/**
 * FREE_WILL — Module #770
 * Free will simulation engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface FreeWillState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FreeWill {
  private states: Map<string, FreeWillState> = new Map();

  private getOrCreate(entityId: string): FreeWillState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FreeWillState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'free_will', value: state.value }, '[FreeWill] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'free_will' }, '[FreeWill] Reset');
  }

  getState(entityId: string): FreeWillState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FreeWillState> {
    return this.states;
  }
}

export const freeWill = new FreeWill();
export default freeWill;
