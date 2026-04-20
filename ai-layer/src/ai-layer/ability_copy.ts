import { logger } from '../lib/logger.js';

/**
 * ABILITY_COPY — Module #695
 * Ability duplication system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface AbilityCopyState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AbilityCopy {
  private states: Map<string, AbilityCopyState> = new Map();

  private getOrCreate(entityId: string): AbilityCopyState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AbilityCopyState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ability_copy', value: state.value }, '[AbilityCopy] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ability_copy' }, '[AbilityCopy] Reset');
  }

  getState(entityId: string): AbilityCopyState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AbilityCopyState> {
    return this.states;
  }
}

export const abilityCopy = new AbilityCopy();
export default abilityCopy;
