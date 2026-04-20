import { logger } from '../lib/logger.js';

/**
 * SERVICE_LOCATOR — Module #383
 * Service discovery and location
 * Kategori: MESIN & SISTEM
 */
export interface ServiceLocatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ServiceLocator {
  private states: Map<string, ServiceLocatorState> = new Map();

  private getOrCreate(entityId: string): ServiceLocatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ServiceLocatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'service_locator', value: state.value }, '[ServiceLocator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'service_locator' }, '[ServiceLocator] Reset');
  }

  getState(entityId: string): ServiceLocatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ServiceLocatorState> {
    return this.states;
  }
}

export const serviceLocator = new ServiceLocator();
export default serviceLocator;
