import { logger } from '../lib/logger.js';

/**
 * UNICAST_PROTOCOL — Module #531
 * Unicast point-to-point protocol
 * Kategori: JARINGAN & KONEKSI
 */
export interface UnicastProtocolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UnicastProtocol {
  private states: Map<string, UnicastProtocolState> = new Map();

  private getOrCreate(entityId: string): UnicastProtocolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UnicastProtocolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'unicast_protocol', value: state.value }, '[UnicastProtocol] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'unicast_protocol' }, '[UnicastProtocol] Reset');
  }

  getState(entityId: string): UnicastProtocolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UnicastProtocolState> {
    return this.states;
  }
}

export const unicastProtocol = new UnicastProtocol();
export default unicastProtocol;
