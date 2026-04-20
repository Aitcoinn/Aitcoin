import { logger } from '../lib/logger.js';

/**
 * NTP_CLIENT — Module #547
 * NTP client implementation
 * Kategori: JARINGAN & KONEKSI
 */
export interface NTPClientState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NTPClient {
  private states: Map<string, NTPClientState> = new Map();

  private getOrCreate(entityId: string): NTPClientState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NTPClientState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ntp_client', value: state.value }, '[NTPClient] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ntp_client' }, '[NTPClient] Reset');
  }

  getState(entityId: string): NTPClientState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NTPClientState> {
    return this.states;
  }
}

export const ntpClient = new NTPClient();
export default ntpClient;
