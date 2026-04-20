import { logger } from '../lib/logger.js';

/**
 * PHISHING_BLOCKER — Module #454
 * Phishing attempt blocking
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface PhishingBlockerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PhishingBlocker {
  private states: Map<string, PhishingBlockerState> = new Map();

  private getOrCreate(entityId: string): PhishingBlockerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PhishingBlockerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'phishing_blocker', value: state.value }, '[PhishingBlocker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'phishing_blocker' }, '[PhishingBlocker] Reset');
  }

  getState(entityId: string): PhishingBlockerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PhishingBlockerState> {
    return this.states;
  }
}

export const phishingBlocker = new PhishingBlocker();
export default phishingBlocker;
