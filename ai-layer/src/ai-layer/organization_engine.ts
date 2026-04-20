import { logger } from '../lib/logger.js';

/**
 * ORGANIZATION_ENGINE — Module #336
 * Organizational structure engine
 * Kategori: MESIN & SISTEM
 */
export interface OrganizationEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OrganizationEngine {
  private states: Map<string, OrganizationEngineState> = new Map();

  private getOrCreate(entityId: string): OrganizationEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OrganizationEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'organization_engine', value: state.value }, '[OrganizationEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'organization_engine' }, '[OrganizationEngine] Reset');
  }

  getState(entityId: string): OrganizationEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OrganizationEngineState> {
    return this.states;
  }
}

export const organizationEngine = new OrganizationEngine();
export default organizationEngine;
