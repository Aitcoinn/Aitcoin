import { logger } from '../lib/logger.js';

/**
 * BINARY_TALK — Module #636
 * Binary communication system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface BinaryTalkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BinaryTalk {
  private states: Map<string, BinaryTalkState> = new Map();

  private getOrCreate(entityId: string): BinaryTalkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BinaryTalkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'binary_talk', value: state.value }, '[BinaryTalk] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'binary_talk' }, '[BinaryTalk] Reset');
  }

  getState(entityId: string): BinaryTalkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BinaryTalkState> {
    return this.states;
  }
}

export const binaryTalk = new BinaryTalk();
export default binaryTalk;
