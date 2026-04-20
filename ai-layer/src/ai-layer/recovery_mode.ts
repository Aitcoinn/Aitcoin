import { logger } from '../lib/logger.js';

/**
 * RECOVERY_MODE — Module #484
 * System recovery mode
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface RecoveryModeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RecoveryMode {
  private states: Map<string, RecoveryModeState> = new Map();

  private getOrCreate(entityId: string): RecoveryModeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RecoveryModeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'recovery_mode', value: state.value }, '[RecoveryMode] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'recovery_mode' }, '[RecoveryMode] Reset');
  }

  getState(entityId: string): RecoveryModeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RecoveryModeState> {
    return this.states;
  }
}

export const recoveryMode = new RecoveryMode();
export default recoveryMode;
