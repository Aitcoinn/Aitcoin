import { logger } from '../lib/logger.js';

/**
 * ROLLBACK_SYSTEM — Module #485
 * State rollback system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface RollbackSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RollbackSystem {
  private states: Map<string, RollbackSystemState> = new Map();

  private getOrCreate(entityId: string): RollbackSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RollbackSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rollback_system', value: state.value }, '[RollbackSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rollback_system' }, '[RollbackSystem] Reset');
  }

  getState(entityId: string): RollbackSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RollbackSystemState> {
    return this.states;
  }
}

export const rollbackSystem = new RollbackSystem();
export default rollbackSystem;
