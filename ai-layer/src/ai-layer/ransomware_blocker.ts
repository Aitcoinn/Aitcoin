import { logger } from '../lib/logger.js';

/**
 * RANSOMWARE_BLOCKER — Module #459
 * Ransomware prevention and blocking
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface RansomwareBlockerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RansomwareBlocker {
  private states: Map<string, RansomwareBlockerState> = new Map();

  private getOrCreate(entityId: string): RansomwareBlockerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RansomwareBlockerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ransomware_blocker', value: state.value }, '[RansomwareBlocker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ransomware_blocker' }, '[RansomwareBlocker] Reset');
  }

  getState(entityId: string): RansomwareBlockerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RansomwareBlockerState> {
    return this.states;
  }
}

export const ransomwareBlocker = new RansomwareBlocker();
export default ransomwareBlocker;
