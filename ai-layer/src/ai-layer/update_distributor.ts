import { logger } from '../lib/logger.js';

/**
 * UPDATE_DISTRIBUTOR — Module #555
 * Update distribution system
 * Kategori: JARINGAN & KONEKSI
 */
export interface UpdateDistributorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UpdateDistributor {
  private states: Map<string, UpdateDistributorState> = new Map();

  private getOrCreate(entityId: string): UpdateDistributorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UpdateDistributorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'update_distributor', value: state.value }, '[UpdateDistributor] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'update_distributor' }, '[UpdateDistributor] Reset');
  }

  getState(entityId: string): UpdateDistributorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UpdateDistributorState> {
    return this.states;
  }
}

export const updateDistributor = new UpdateDistributor();
export default updateDistributor;
