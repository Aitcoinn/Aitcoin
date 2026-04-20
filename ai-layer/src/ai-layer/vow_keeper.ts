import { logger } from '../lib/logger.js';

/**
 * VOW_KEEPER — Module #893
 * Vow keeping system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface VowKeeperState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VowKeeper {
  private states: Map<string, VowKeeperState> = new Map();

  private getOrCreate(entityId: string): VowKeeperState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): VowKeeperState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'vow_keeper', value: state.value }, '[VowKeeper] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'vow_keeper' }, '[VowKeeper] Reset');
  }

  getState(entityId: string): VowKeeperState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VowKeeperState> {
    return this.states;
  }
}

export const vowKeeper = new VowKeeper();
export default vowKeeper;
