import { logger } from '../lib/logger.js';

/**
 * ROLE_ASSIGNER — Module #841
 * Role assignment system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface RoleAssignerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RoleAssigner {
  private states: Map<string, RoleAssignerState> = new Map();

  private getOrCreate(entityId: string): RoleAssignerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RoleAssignerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'role_assigner', value: state.value }, '[RoleAssigner] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'role_assigner' }, '[RoleAssigner] Reset');
  }

  getState(entityId: string): RoleAssignerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RoleAssignerState> {
    return this.states;
  }
}

export const roleAssigner = new RoleAssigner();
export default roleAssigner;
