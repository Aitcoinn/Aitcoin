import { logger } from '../lib/logger.js';

/**
 * PACKET_SNIFFER — Module #526
 * Network packet inspection
 * Kategori: JARINGAN & KONEKSI
 */
export interface PacketSnifferState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PacketSniffer {
  private states: Map<string, PacketSnifferState> = new Map();

  private getOrCreate(entityId: string): PacketSnifferState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PacketSnifferState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'packet_sniffer', value: state.value }, '[PacketSniffer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'packet_sniffer' }, '[PacketSniffer] Reset');
  }

  getState(entityId: string): PacketSnifferState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PacketSnifferState> {
    return this.states;
  }
}

export const packetSniffer = new PacketSniffer();
export default packetSniffer;
