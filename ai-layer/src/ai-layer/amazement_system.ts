import { logger } from '../lib/logger.js';

/**
 * AMAZEMENT_SYSTEM — Module #960
 * Amazement generation system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface AmazementSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AmazementSystem {
  private states: Map<string, AmazementSystemState> = new Map();

  private getOrCreate(entityId: string): AmazementSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AmazementSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'amazement_system', value: state.value }, '[AmazementSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'amazement_system' }, '[AmazementSystem] Reset');
  }

  getState(entityId: string): AmazementSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AmazementSystemState> {
    return this.states;
  }
}

export const amazementSystem = new AmazementSystem();
export default amazementSystem;
