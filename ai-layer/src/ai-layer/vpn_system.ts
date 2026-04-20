import { logger } from '../lib/logger.js';

/**
 * VPN_SYSTEM — Module #566
 * Virtual private network system
 * Kategori: JARINGAN & KONEKSI
 */
export interface VPNSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VPNSystem {
  private states: Map<string, VPNSystemState> = new Map();

  private getOrCreate(entityId: string): VPNSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): VPNSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'vpn_system', value: state.value }, '[VPNSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'vpn_system' }, '[VPNSystem] Reset');
  }

  getState(entityId: string): VPNSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VPNSystemState> {
    return this.states;
  }
}

export const vpnSystem = new VPNSystem();
export default vpnSystem;
