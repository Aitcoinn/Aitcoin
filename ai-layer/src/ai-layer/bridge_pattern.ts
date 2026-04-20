import { logger } from '../lib/logger.js';

/**
 * BRIDGE_PATTERN — Module #399
 * Bridge pattern for abstraction decoupling
 * Kategori: MESIN & SISTEM
 */
export interface BridgePatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BridgePattern {
  private states: Map<string, BridgePatternState> = new Map();

  private getOrCreate(entityId: string): BridgePatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BridgePatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'bridge_pattern', value: state.value }, '[BridgePattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'bridge_pattern' }, '[BridgePattern] Reset');
  }

  getState(entityId: string): BridgePatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BridgePatternState> {
    return this.states;
  }
}

export const bridgePattern = new BridgePattern();
export default bridgePattern;
