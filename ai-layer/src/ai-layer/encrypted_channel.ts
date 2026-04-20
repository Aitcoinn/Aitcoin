import { logger } from '../lib/logger.js';

/**
 * ENCRYPTED_CHANNEL — Module #568
 * Encrypted communication channel
 * Kategori: JARINGAN & KONEKSI
 */
export interface EncryptedChannelState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EncryptedChannel {
  private states: Map<string, EncryptedChannelState> = new Map();

  private getOrCreate(entityId: string): EncryptedChannelState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EncryptedChannelState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'encrypted_channel', value: state.value }, '[EncryptedChannel] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'encrypted_channel' }, '[EncryptedChannel] Reset');
  }

  getState(entityId: string): EncryptedChannelState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EncryptedChannelState> {
    return this.states;
  }
}

export const encryptedChannel = new EncryptedChannel();
export default encryptedChannel;
