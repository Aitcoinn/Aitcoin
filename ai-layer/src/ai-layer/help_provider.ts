import { logger } from '../lib/logger.js';

/**
 * HELP_PROVIDER — Module #881
 * Help provision system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface HelpProviderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HelpProvider {
  private states: Map<string, HelpProviderState> = new Map();

  private getOrCreate(entityId: string): HelpProviderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HelpProviderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'help_provider', value: state.value }, '[HelpProvider] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'help_provider' }, '[HelpProvider] Reset');
  }

  getState(entityId: string): HelpProviderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HelpProviderState> {
    return this.states;
  }
}

export const helpProvider = new HelpProvider();
export default helpProvider;
