import { logger } from '../lib/logger.js';

/**
 * UPGRADE_MANAGER — Module #557
 * System upgrade management
 * Kategori: JARINGAN & KONEKSI
 */
export interface UpgradeManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UpgradeManager {
  private states: Map<string, UpgradeManagerState> = new Map();

  private getOrCreate(entityId: string): UpgradeManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UpgradeManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'upgrade_manager', value: state.value }, '[UpgradeManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'upgrade_manager' }, '[UpgradeManager] Reset');
  }

  getState(entityId: string): UpgradeManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UpgradeManagerState> {
    return this.states;
  }
}

export const upgradeManager = new UpgradeManager();
export default upgradeManager;
