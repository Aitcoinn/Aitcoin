import { logger } from '../lib/logger.js';

/**
 * INSTANT_TRANSFER — Module #594
 * Instant data transfer system
 * Kategori: JARINGAN & KONEKSI
 */
export interface InstantTransferState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InstantTransfer {
  private states: Map<string, InstantTransferState> = new Map();

  private getOrCreate(entityId: string): InstantTransferState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InstantTransferState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'instant_transfer', value: state.value }, '[InstantTransfer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'instant_transfer' }, '[InstantTransfer] Reset');
  }

  getState(entityId: string): InstantTransferState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InstantTransferState> {
    return this.states;
  }
}

export const instantTransfer = new InstantTransfer();
export default instantTransfer;
