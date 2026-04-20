import { logger } from '../lib/logger.js';

/**
 * APPEARANCE_MOD — Module #929
 * Appearance modification system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface AppearanceModState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AppearanceMod {
  private states: Map<string, AppearanceModState> = new Map();

  private getOrCreate(entityId: string): AppearanceModState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AppearanceModState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'appearance_mod', value: state.value }, '[AppearanceMod] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'appearance_mod' }, '[AppearanceMod] Reset');
  }

  getState(entityId: string): AppearanceModState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AppearanceModState> {
    return this.states;
  }
}

export const appearanceMod = new AppearanceMod();
export default appearanceMod;
