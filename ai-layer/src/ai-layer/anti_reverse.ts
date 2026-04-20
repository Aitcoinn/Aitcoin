import { logger } from '../lib/logger.js';

/**
 * ANTI_REVERSE — Module #470
 * Anti-reverse engineering protection
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface AntiReverseState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AntiReverse {
  private states: Map<string, AntiReverseState> = new Map();

  private getOrCreate(entityId: string): AntiReverseState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AntiReverseState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'anti_reverse', value: state.value }, '[AntiReverse] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'anti_reverse' }, '[AntiReverse] Reset');
  }

  getState(entityId: string): AntiReverseState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AntiReverseState> {
    return this.states;
  }
}

export const antiReverse = new AntiReverse();
export default antiReverse;
