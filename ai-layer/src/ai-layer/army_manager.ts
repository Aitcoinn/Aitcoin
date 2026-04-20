import { logger } from '../lib/logger.js';

/**
 * ARMY_MANAGER — Module #860
 * Army management system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ArmyManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ArmyManager {
  private states: Map<string, ArmyManagerState> = new Map();

  private getOrCreate(entityId: string): ArmyManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ArmyManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'army_manager', value: state.value }, '[ArmyManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'army_manager' }, '[ArmyManager] Reset');
  }

  getState(entityId: string): ArmyManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ArmyManagerState> {
    return this.states;
  }
}

export const armyManager = new ArmyManager();
export default armyManager;
