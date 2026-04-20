import { logger } from '../lib/logger.js';

/**
 * CURIOSITY_SATISFIER — Module #958
 * Curiosity satisfaction engine
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface CuriositySatisfierState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CuriositySatisfier {
  private states: Map<string, CuriositySatisfierState> = new Map();

  private getOrCreate(entityId: string): CuriositySatisfierState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CuriositySatisfierState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'curiosity_satisfier', value: state.value }, '[CuriositySatisfier] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'curiosity_satisfier' }, '[CuriositySatisfier] Reset');
  }

  getState(entityId: string): CuriositySatisfierState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CuriositySatisfierState> {
    return this.states;
  }
}

export const curiositySatisfier = new CuriositySatisfier();
export default curiositySatisfier;
