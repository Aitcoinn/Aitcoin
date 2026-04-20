import { logger } from '../lib/logger.js';

/**
 * BUTTERFLY_EFFECT_SYS — Module #776
 * Butterfly effect simulation
 * Kategori: PERSEPSI & REALITAS
 */
export interface ButterflyEffectSysState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ButterflyEffectSys {
  private states: Map<string, ButterflyEffectSysState> = new Map();

  private getOrCreate(entityId: string): ButterflyEffectSysState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ButterflyEffectSysState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'butterfly_effect_sys', value: state.value }, '[ButterflyEffectSys] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'butterfly_effect_sys' }, '[ButterflyEffectSys] Reset');
  }

  getState(entityId: string): ButterflyEffectSysState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ButterflyEffectSysState> {
    return this.states;
  }
}

export const butterflyEffectSys = new ButterflyEffectSys();
export default butterflyEffectSys;
