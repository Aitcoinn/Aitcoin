import { logger } from '../lib/logger.js';

/**
 * INVISIBILITY_CLOAK — Module #417
 * System invisibility and concealment
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface InvisibilityCloakState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InvisibilityCloak {
  private states: Map<string, InvisibilityCloakState> = new Map();

  private getOrCreate(entityId: string): InvisibilityCloakState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InvisibilityCloakState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'invisibility_cloak', value: state.value }, '[InvisibilityCloak] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'invisibility_cloak' }, '[InvisibilityCloak] Reset');
  }

  getState(entityId: string): InvisibilityCloakState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InvisibilityCloakState> {
    return this.states;
  }
}

export const invisibilityCloak = new InvisibilityCloak();
export default invisibilityCloak;
