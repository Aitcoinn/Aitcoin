import { logger } from '../lib/logger.js';

/**
 * RIPPLE_EFFECT — Module #777
 * Ripple effect propagation
 * Kategori: PERSEPSI & REALITAS
 */
export interface RippleEffectState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RippleEffect {
  private states: Map<string, RippleEffectState> = new Map();

  private getOrCreate(entityId: string): RippleEffectState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RippleEffectState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ripple_effect', value: state.value }, '[RippleEffect] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ripple_effect' }, '[RippleEffect] Reset');
  }

  getState(entityId: string): RippleEffectState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RippleEffectState> {
    return this.states;
  }
}

export const rippleEffect = new RippleEffect();
export default rippleEffect;
