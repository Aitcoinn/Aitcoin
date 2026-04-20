import { logger } from '../lib/logger.js';

/**
 * RESOURCE_LOCATOR — Module #578
 * Resource location and retrieval
 * Kategori: JARINGAN & KONEKSI
 */
export interface ResourceLocatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ResourceLocator {
  private states: Map<string, ResourceLocatorState> = new Map();

  private getOrCreate(entityId: string): ResourceLocatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ResourceLocatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'resource_locator', value: state.value }, '[ResourceLocator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'resource_locator' }, '[ResourceLocator] Reset');
  }

  getState(entityId: string): ResourceLocatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ResourceLocatorState> {
    return this.states;
  }
}

export const resourceLocator = new ResourceLocator();
export default resourceLocator;
