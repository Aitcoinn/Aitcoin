import { logger } from '../lib/logger.js';

/**
 * COMMENT_SYSTEM — Module #681
 * Comment management system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface CommentSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CommentSystem {
  private states: Map<string, CommentSystemState> = new Map();

  private getOrCreate(entityId: string): CommentSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CommentSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'comment_system', value: state.value }, '[CommentSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'comment_system' }, '[CommentSystem] Reset');
  }

  getState(entityId: string): CommentSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CommentSystemState> {
    return this.states;
  }
}

export const commentSystem = new CommentSystem();
export default commentSystem;
