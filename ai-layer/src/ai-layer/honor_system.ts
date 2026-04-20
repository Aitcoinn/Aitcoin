import { logger } from '../lib/logger.js';

/**
 * HONOR_SYSTEM — Module #821
 * Honor and prestige system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface HonorSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HonorSystem {
  private states: Map<string, HonorSystemState> = new Map();

  private getOrCreate(entityId: string): HonorSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HonorSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'honor_system', value: state.value }, '[HonorSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'honor_system' }, '[HonorSystem] Reset');
  }

  getState(entityId: string): HonorSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HonorSystemState> {
    return this.states;
  }
}

export const honorSystem = new HonorSystem();
export default honorSystem;
