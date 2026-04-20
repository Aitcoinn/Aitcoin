import { logger } from '../lib/logger.js';

/**
 * PLUGIN_LOADER — Module #380
 * Dynamic plugin loading system
 * Kategori: MESIN & SISTEM
 */
export interface PluginLoaderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PluginLoader {
  private states: Map<string, PluginLoaderState> = new Map();

  private getOrCreate(entityId: string): PluginLoaderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PluginLoaderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'plugin_loader', value: state.value }, '[PluginLoader] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'plugin_loader' }, '[PluginLoader] Reset');
  }

  getState(entityId: string): PluginLoaderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PluginLoaderState> {
    return this.states;
  }
}

export const pluginLoader = new PluginLoader();
export default pluginLoader;
