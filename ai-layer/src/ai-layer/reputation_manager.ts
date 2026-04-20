import { logger } from '../lib/logger.js';

/**
 * REPUTATION_MANAGER — Module #823
 * Reputation management system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ReputationManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ReputationManager {
  private states: Map<string, ReputationManagerState> = new Map();

  private getOrCreate(entityId: string): ReputationManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ReputationManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reputation_manager', value: state.value }, '[ReputationManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reputation_manager' }, '[ReputationManager] Reset');
  }

  getState(entityId: string): ReputationManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ReputationManagerState> {
    return this.states;
  }
}

export const reputationManager = new ReputationManager();
export default reputationManager;
