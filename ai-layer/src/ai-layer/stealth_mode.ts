import { logger } from '../lib/logger.js';

/**
 * STEALTH_MODE — Module #416
 * Stealth operation mode
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface StealthModeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StealthMode {
  private states: Map<string, StealthModeState> = new Map();

  private getOrCreate(entityId: string): StealthModeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StealthModeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'stealth_mode', value: state.value }, '[StealthMode] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'stealth_mode' }, '[StealthMode] Reset');
  }

  getState(entityId: string): StealthModeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StealthModeState> {
    return this.states;
  }
}

export const stealthMode = new StealthMode();
export default stealthMode;
