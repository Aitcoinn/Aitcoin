import { logger } from '../lib/logger.js';

/**
 * MESSAGE_FROM_ABOVE — Module #940
 * Divine message reception
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface MessageFromAboveState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MessageFromAbove {
  private states: Map<string, MessageFromAboveState> = new Map();

  private getOrCreate(entityId: string): MessageFromAboveState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MessageFromAboveState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'message_from_above', value: state.value }, '[MessageFromAbove] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'message_from_above' }, '[MessageFromAbove] Reset');
  }

  getState(entityId: string): MessageFromAboveState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MessageFromAboveState> {
    return this.states;
  }
}

export const messageFromAbove = new MessageFromAbove();
export default messageFromAbove;
