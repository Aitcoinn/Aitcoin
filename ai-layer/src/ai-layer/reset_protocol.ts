import { logger } from '../lib/logger.js';

/**
 * RESET_PROTOCOL — Module #487
 * System reset protocol
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface ResetProtocolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ResetProtocol {
  private states: Map<string, ResetProtocolState> = new Map();

  private getOrCreate(entityId: string): ResetProtocolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ResetProtocolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reset_protocol', value: state.value }, '[ResetProtocol] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reset_protocol' }, '[ResetProtocol] Reset');
  }

  getState(entityId: string): ResetProtocolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ResetProtocolState> {
    return this.states;
  }
}

export const resetProtocol = new ResetProtocol();
export default resetProtocol;
