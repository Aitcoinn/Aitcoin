import { logger } from '../lib/logger.js';

/**
 * SPAM_FILTER — Module #455
 * Spam detection and filtering
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface SpamFilterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpamFilter {
  private states: Map<string, SpamFilterState> = new Map();

  private getOrCreate(entityId: string): SpamFilterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpamFilterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'spam_filter', value: state.value }, '[SpamFilter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'spam_filter' }, '[SpamFilter] Reset');
  }

  getState(entityId: string): SpamFilterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpamFilterState> {
    return this.states;
  }
}

export const spamFilter = new SpamFilter();
export default spamFilter;
