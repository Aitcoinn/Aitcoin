import { logger } from '../lib/logger.js';

/**
 * GOVERNOR_SYSTEM — Module #836
 * Governor-level management
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface GovernorSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GovernorSystem {
  private states: Map<string, GovernorSystemState> = new Map();

  private getOrCreate(entityId: string): GovernorSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GovernorSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'governor_system', value: state.value }, '[GovernorSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'governor_system' }, '[GovernorSystem] Reset');
  }

  getState(entityId: string): GovernorSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GovernorSystemState> {
    return this.states;
  }
}

export const governorSystem = new GovernorSystem();
export default governorSystem;
