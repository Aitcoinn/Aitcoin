import { logger } from '../lib/logger.js';

/**
 * MESSAGE_BROKER — Module #533
 * Message brokering and routing
 * Kategori: JARINGAN & KONEKSI
 */
export interface MessageBrokerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MessageBroker {
  private states: Map<string, MessageBrokerState> = new Map();

  private getOrCreate(entityId: string): MessageBrokerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MessageBrokerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'message_broker', value: state.value }, '[MessageBroker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'message_broker' }, '[MessageBroker] Reset');
  }

  getState(entityId: string): MessageBrokerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MessageBrokerState> {
    return this.states;
  }
}

export const messageBroker = new MessageBroker();
export default messageBroker;
