import { logger } from '../lib/logger.js';

/**
 * RITUAL_CASTER — Module #918
 * Ritual execution engine
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface RitualCasterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RitualCaster {
  private states: Map<string, RitualCasterState> = new Map();

  private getOrCreate(entityId: string): RitualCasterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RitualCasterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ritual_caster', value: state.value }, '[RitualCaster] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ritual_caster' }, '[RitualCaster] Reset');
  }

  getState(entityId: string): RitualCasterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RitualCasterState> {
    return this.states;
  }
}

export const ritualCaster = new RitualCaster();
export default ritualCaster;
