import { logger } from '../lib/logger.js';

/**
 * GATE_KEEPER — Module #949
 * Gate keeping system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface GateKeeperState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GateKeeper {
  private states: Map<string, GateKeeperState> = new Map();

  private getOrCreate(entityId: string): GateKeeperState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GateKeeperState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'gate_keeper', value: state.value }, '[GateKeeper] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'gate_keeper' }, '[GateKeeper] Reset');
  }

  getState(entityId: string): GateKeeperState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GateKeeperState> {
    return this.states;
  }
}

export const gateKeeper = new GateKeeper();
export default gateKeeper;
