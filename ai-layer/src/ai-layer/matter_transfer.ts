import { logger } from '../lib/logger.js';

/**
 * MATTER_TRANSFER — Module #790
 * Matter transfer system
 * Kategori: PERSEPSI & REALITAS
 */
export interface MatterTransferState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MatterTransfer {
  private states: Map<string, MatterTransferState> = new Map();

  private getOrCreate(entityId: string): MatterTransferState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MatterTransferState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'matter_transfer', value: state.value }, '[MatterTransfer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'matter_transfer' }, '[MatterTransfer] Reset');
  }

  getState(entityId: string): MatterTransferState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MatterTransferState> {
    return this.states;
  }
}

export const matterTransfer = new MatterTransfer();
export default matterTransfer;
