import { logger } from '../lib/logger.js';

/**
 * PUSH_SERVICE — Module #540
 * Push notification service
 * Kategori: JARINGAN & KONEKSI
 */
export interface PushServiceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PushService {
  private states: Map<string, PushServiceState> = new Map();

  private getOrCreate(entityId: string): PushServiceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PushServiceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'push_service', value: state.value }, '[PushService] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'push_service' }, '[PushService] Reset');
  }

  getState(entityId: string): PushServiceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PushServiceState> {
    return this.states;
  }
}

export const pushService = new PushService();
export default pushService;
