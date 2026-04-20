import { logger } from '../lib/logger.js';

/**
 * IMMORTAL_MODE — Module #969
 * Immortality mode system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface ImmortalModeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ImmortalMode {
  private states: Map<string, ImmortalModeState> = new Map();

  private getOrCreate(entityId: string): ImmortalModeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ImmortalModeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'immortal_mode', value: state.value }, '[ImmortalMode] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'immortal_mode' }, '[ImmortalMode] Reset');
  }

  getState(entityId: string): ImmortalModeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ImmortalModeState> {
    return this.states;
  }
}

export const immortalMode = new ImmortalMode();
export default immortalMode;
