import { logger } from '../lib/logger.js';

/**
 * TOPIC_SUBSCRIBER — Module #535
 * Topic-based pub/sub system
 * Kategori: JARINGAN & KONEKSI
 */
export interface TopicSubscriberState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TopicSubscriber {
  private states: Map<string, TopicSubscriberState> = new Map();

  private getOrCreate(entityId: string): TopicSubscriberState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TopicSubscriberState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'topic_subscriber', value: state.value }, '[TopicSubscriber] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'topic_subscriber' }, '[TopicSubscriber] Reset');
  }

  getState(entityId: string): TopicSubscriberState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TopicSubscriberState> {
    return this.states;
  }
}

export const topicSubscriber = new TopicSubscriber();
export default topicSubscriber;
