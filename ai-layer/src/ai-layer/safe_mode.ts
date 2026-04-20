import { logger } from '../lib/logger.js';

/**
 * SAFE_MODE — Module #483
 * Protected safe mode operation
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface SafeModeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SafeMode {
  private states: Map<string, SafeModeState> = new Map();

  private getOrCreate(entityId: string): SafeModeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SafeModeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'safe_mode', value: state.value }, '[SafeMode] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'safe_mode' }, '[SafeMode] Reset');
  }

  getState(entityId: string): SafeModeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SafeModeState> {
    return this.states;
  }
}

export const safeMode = new SafeMode();
export default safeMode;
