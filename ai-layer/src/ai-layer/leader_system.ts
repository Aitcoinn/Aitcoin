import { logger } from '../lib/logger.js';

/**
 * LEADER_SYSTEM — Module #832
 * Leadership management system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface LeaderSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LeaderSystem {
  private states: Map<string, LeaderSystemState> = new Map();

  private getOrCreate(entityId: string): LeaderSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LeaderSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'leader_system', value: state.value }, '[LeaderSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'leader_system' }, '[LeaderSystem] Reset');
  }

  getState(entityId: string): LeaderSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LeaderSystemState> {
    return this.states;
  }
}

export const leaderSystem = new LeaderSystem();
export default leaderSystem;
