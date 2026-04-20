import { logger } from '../lib/logger.js';

/**
 * CRISIS_MANAGER — Module #878
 * Crisis management system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CrisisManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CrisisManager {
  private states: Map<string, CrisisManagerState> = new Map();

  private getOrCreate(entityId: string): CrisisManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CrisisManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'crisis_manager', value: state.value }, '[CrisisManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'crisis_manager' }, '[CrisisManager] Reset');
  }

  getState(entityId: string): CrisisManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CrisisManagerState> {
    return this.states;
  }
}

export const crisisManager = new CrisisManager();
export default crisisManager;
