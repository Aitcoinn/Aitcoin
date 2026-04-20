import { logger } from '../lib/logger.js';

/**
 * WORM_DESTROYER — Module #457
 * Worm detection and elimination
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface WormDestroyerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WormDestroyer {
  private states: Map<string, WormDestroyerState> = new Map();

  private getOrCreate(entityId: string): WormDestroyerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WormDestroyerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'worm_destroyer', value: state.value }, '[WormDestroyer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'worm_destroyer' }, '[WormDestroyer] Reset');
  }

  getState(entityId: string): WormDestroyerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WormDestroyerState> {
    return this.states;
  }
}

export const wormDestroyer = new WormDestroyer();
export default wormDestroyer;
