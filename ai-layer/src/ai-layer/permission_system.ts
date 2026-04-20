import { logger } from '../lib/logger.js';

/**
 * PERMISSION_SYSTEM — Module #440
 * Permission management system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface PermissionSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PermissionSystem {
  private states: Map<string, PermissionSystemState> = new Map();

  private getOrCreate(entityId: string): PermissionSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PermissionSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'permission_system', value: state.value }, '[PermissionSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'permission_system' }, '[PermissionSystem] Reset');
  }

  getState(entityId: string): PermissionSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PermissionSystemState> {
    return this.states;
  }
}

export const permissionSystem = new PermissionSystem();
export default permissionSystem;
