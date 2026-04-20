import { logger } from '../lib/logger.js';

/**
 * MODULE_MANAGER — Module #381
 * Module registration and management
 * Kategori: MESIN & SISTEM
 */
export interface ModuleManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ModuleManager {
  private states: Map<string, ModuleManagerState> = new Map();

  private getOrCreate(entityId: string): ModuleManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ModuleManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'module_manager', value: state.value }, '[ModuleManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'module_manager' }, '[ModuleManager] Reset');
  }

  getState(entityId: string): ModuleManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ModuleManagerState> {
    return this.states;
  }
}

export const moduleManager = new ModuleManager();
export default moduleManager;
