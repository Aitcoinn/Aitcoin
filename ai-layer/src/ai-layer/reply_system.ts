import { logger } from '../lib/logger.js';

/**
 * REPLY_SYSTEM — Module #679
 * Reply generation system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ReplySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ReplySystem {
  private states: Map<string, ReplySystemState> = new Map();

  private getOrCreate(entityId: string): ReplySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ReplySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reply_system', value: state.value }, '[ReplySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reply_system' }, '[ReplySystem] Reset');
  }

  getState(entityId: string): ReplySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ReplySystemState> {
    return this.states;
  }
}

export const replySystem = new ReplySystem();
export default replySystem;
