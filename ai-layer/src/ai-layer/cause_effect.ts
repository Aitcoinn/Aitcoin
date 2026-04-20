import { logger } from '../lib/logger.js';

/**
 * CAUSE_EFFECT — Module #772
 * Cause and effect chain
 * Kategori: PERSEPSI & REALITAS
 */
export interface CauseEffectState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CauseEffect {
  private states: Map<string, CauseEffectState> = new Map();

  private getOrCreate(entityId: string): CauseEffectState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CauseEffectState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'cause_effect', value: state.value }, '[CauseEffect] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'cause_effect' }, '[CauseEffect] Reset');
  }

  getState(entityId: string): CauseEffectState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CauseEffectState> {
    return this.states;
  }
}

export const causeEffect = new CauseEffect();
export default causeEffect;
