import { logger } from '../lib/logger.js';

/**
 * COMPONENT_SYSTEM — Module #382
 * Component lifecycle management
 * Kategori: MESIN & SISTEM
 */
export interface ComponentSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ComponentSystem {
  private states: Map<string, ComponentSystemState> = new Map();

  private getOrCreate(entityId: string): ComponentSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ComponentSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'component_system', value: state.value }, '[ComponentSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'component_system' }, '[ComponentSystem] Reset');
  }

  getState(entityId: string): ComponentSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ComponentSystemState> {
    return this.states;
  }
}

export const componentSystem = new ComponentSystem();
export default componentSystem;
