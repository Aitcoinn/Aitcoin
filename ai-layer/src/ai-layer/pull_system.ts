import { logger } from '../lib/logger.js';

/**
 * PULL_SYSTEM — Module #541
 * Pull-based data fetching system
 * Kategori: JARINGAN & KONEKSI
 */
export interface PullSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PullSystem {
  private states: Map<string, PullSystemState> = new Map();

  private getOrCreate(entityId: string): PullSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PullSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'pull_system', value: state.value }, '[PullSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'pull_system' }, '[PullSystem] Reset');
  }

  getState(entityId: string): PullSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PullSystemState> {
    return this.states;
  }
}

export const pullSystem = new PullSystem();
export default pullSystem;
