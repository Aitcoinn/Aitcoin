import { logger } from '../lib/logger.js';

/**
 * DESTINY_MANAGER — Module #768
 * Destiny path management
 * Kategori: PERSEPSI & REALITAS
 */
export interface DestinyManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DestinyManager {
  private states: Map<string, DestinyManagerState> = new Map();

  private getOrCreate(entityId: string): DestinyManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DestinyManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'destiny_manager', value: state.value }, '[DestinyManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'destiny_manager' }, '[DestinyManager] Reset');
  }

  getState(entityId: string): DestinyManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DestinyManagerState> {
    return this.states;
  }
}

export const destinyManager = new DestinyManager();
export default destinyManager;
