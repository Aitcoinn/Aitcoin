import { logger } from '../lib/logger.js';

/**
 * GROUP_SYSTEM — Module #799
 * Group dynamics management
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface GroupSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GroupSystem {
  private states: Map<string, GroupSystemState> = new Map();

  private getOrCreate(entityId: string): GroupSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GroupSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'group_system', value: state.value }, '[GroupSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'group_system' }, '[GroupSystem] Reset');
  }

  getState(entityId: string): GroupSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GroupSystemState> {
    return this.states;
  }
}

export const groupSystem = new GroupSystem();
export default groupSystem;
