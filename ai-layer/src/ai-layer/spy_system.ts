import { logger } from '../lib/logger.js';

/**
 * SPY_SYSTEM — Module #864
 * Intelligence gathering system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface SpySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpySystem {
  private states: Map<string, SpySystemState> = new Map();

  private getOrCreate(entityId: string): SpySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'spy_system', value: state.value }, '[SpySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'spy_system' }, '[SpySystem] Reset');
  }

  getState(entityId: string): SpySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpySystemState> {
    return this.states;
  }
}

export const spySystem = new SpySystem();
export default spySystem;
