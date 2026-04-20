import { logger } from '../lib/logger.js';

/**
 * NOTIFICATION_BROADCAST — Module #874
 * Notification broadcast system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface NotificationBroadcastState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NotificationBroadcast {
  private states: Map<string, NotificationBroadcastState> = new Map();

  private getOrCreate(entityId: string): NotificationBroadcastState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NotificationBroadcastState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'notification_broadcast', value: state.value }, '[NotificationBroadcast] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'notification_broadcast' }, '[NotificationBroadcast] Reset');
  }

  getState(entityId: string): NotificationBroadcastState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NotificationBroadcastState> {
    return this.states;
  }
}

export const notificationBroadcast = new NotificationBroadcast();
export default notificationBroadcast;
