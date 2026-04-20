import { logger } from '../lib/logger.js';

/**
 * NOTIFICATION_SYSTEM — Module #539
 * Notification management system
 * Kategori: JARINGAN & KONEKSI
 */
export interface NotificationSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NotificationSystem {
  private states: Map<string, NotificationSystemState> = new Map();

  private getOrCreate(entityId: string): NotificationSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NotificationSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'notification_system', value: state.value }, '[NotificationSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'notification_system' }, '[NotificationSystem] Reset');
  }

  getState(entityId: string): NotificationSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NotificationSystemState> {
    return this.states;
  }
}

export const notificationSystem = new NotificationSystem();
export default notificationSystem;
