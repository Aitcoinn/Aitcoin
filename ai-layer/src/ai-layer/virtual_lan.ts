import { logger } from '../lib/logger.js';

/**
 * VIRTUAL_LAN — Module #571
 * Virtual LAN management
 * Kategori: JARINGAN & KONEKSI
 */
export interface VirtualLANState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VirtualLAN {
  private states: Map<string, VirtualLANState> = new Map();

  private getOrCreate(entityId: string): VirtualLANState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): VirtualLANState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'virtual_lan', value: state.value }, '[VirtualLAN] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'virtual_lan' }, '[VirtualLAN] Reset');
  }

  getState(entityId: string): VirtualLANState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VirtualLANState> {
    return this.states;
  }
}

export const virtualLan = new VirtualLAN();
export default virtualLan;
