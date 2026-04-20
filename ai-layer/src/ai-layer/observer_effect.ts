import { logger } from '../lib/logger.js';

/**
 * OBSERVER_EFFECT — Module #783
 * Quantum observer effect
 * Kategori: PERSEPSI & REALITAS
 */
export interface ObserverEffectState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ObserverEffect {
  private states: Map<string, ObserverEffectState> = new Map();

  private getOrCreate(entityId: string): ObserverEffectState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ObserverEffectState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'observer_effect', value: state.value }, '[ObserverEffect] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'observer_effect' }, '[ObserverEffect] Reset');
  }

  getState(entityId: string): ObserverEffectState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ObserverEffectState> {
    return this.states;
  }
}

export const observerEffect = new ObserverEffect();
export default observerEffect;
