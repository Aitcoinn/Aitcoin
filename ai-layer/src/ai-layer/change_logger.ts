import { logger } from '../lib/logger.js';

/**
 * CHANGE_LOGGER — Module #554
 * Change event logging system
 * Kategori: JARINGAN & KONEKSI
 */
export interface ChangeLoggerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChangeLogger {
  private states: Map<string, ChangeLoggerState> = new Map();

  private getOrCreate(entityId: string): ChangeLoggerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChangeLoggerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'change_logger', value: state.value }, '[ChangeLogger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'change_logger' }, '[ChangeLogger] Reset');
  }

  getState(entityId: string): ChangeLoggerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChangeLoggerState> {
    return this.states;
  }
}

export const changeLogger = new ChangeLogger();
export default changeLogger;
