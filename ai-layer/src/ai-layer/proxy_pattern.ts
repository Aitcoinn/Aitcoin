import { logger } from '../lib/logger.js';

/**
 * PROXY_PATTERN — Module #395
 * Proxy pattern for controlled access
 * Kategori: MESIN & SISTEM
 */
export interface ProxyPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ProxyPattern {
  private states: Map<string, ProxyPatternState> = new Map();

  private getOrCreate(entityId: string): ProxyPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ProxyPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'proxy_pattern', value: state.value }, '[ProxyPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'proxy_pattern' }, '[ProxyPattern] Reset');
  }

  getState(entityId: string): ProxyPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ProxyPatternState> {
    return this.states;
  }
}

export const proxyPattern = new ProxyPattern();
export default proxyPattern;
