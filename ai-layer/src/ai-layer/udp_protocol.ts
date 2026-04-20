import { logger } from '../lib/logger.js';

/**
 * UDP_PROTOCOL — Module #506
 * UDP protocol implementation
 * Kategori: JARINGAN & KONEKSI
 */
export interface UDPProtocolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UDPProtocol {
  private states: Map<string, UDPProtocolState> = new Map();

  private getOrCreate(entityId: string): UDPProtocolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UDPProtocolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'udp_protocol', value: state.value }, '[UDPProtocol] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'udp_protocol' }, '[UDPProtocol] Reset');
  }

  getState(entityId: string): UDPProtocolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UDPProtocolState> {
    return this.states;
  }
}

export const udpProtocol = new UDPProtocol();
export default udpProtocol;
