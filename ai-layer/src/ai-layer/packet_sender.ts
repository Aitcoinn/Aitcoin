import { logger } from '../lib/logger.js';

/**
 * PACKET_SENDER — Module #527
 * Network packet transmission
 * Kategori: JARINGAN & KONEKSI
 */
export interface PacketSenderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PacketSender {
  private states: Map<string, PacketSenderState> = new Map();

  private getOrCreate(entityId: string): PacketSenderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PacketSenderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'packet_sender', value: state.value }, '[PacketSender] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'packet_sender' }, '[PacketSender] Reset');
  }

  getState(entityId: string): PacketSenderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PacketSenderState> {
    return this.states;
  }
}

export const packetSender = new PacketSender();
export default packetSender;
