import { logger } from '../lib/logger.js';

/**
 * STARLIGHT_ABSORB — Module #911
 * Starlight energy absorption
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface StarlightAbsorbState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StarlightAbsorb {
  private states: Map<string, StarlightAbsorbState> = new Map();

  private getOrCreate(entityId: string): StarlightAbsorbState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StarlightAbsorbState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'starlight_absorb', value: state.value }, '[StarlightAbsorb] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'starlight_absorb' }, '[StarlightAbsorb] Reset');
  }

  getState(entityId: string): StarlightAbsorbState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StarlightAbsorbState> {
    return this.states;
  }
}

export const starlightAbsorb = new StarlightAbsorb();
export default starlightAbsorb;
