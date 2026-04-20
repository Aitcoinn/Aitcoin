import { logger } from '../lib/logger.js';

/**
 * QUANTUM_STATE — Module #780
 * Quantum state management
 * Kategori: PERSEPSI & REALITAS
 */
export interface QuantumStateState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class QuantumState {
  private states: Map<string, QuantumStateState> = new Map();

  private getOrCreate(entityId: string): QuantumStateState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): QuantumStateState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'quantum_state', value: state.value }, '[QuantumState] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'quantum_state' }, '[QuantumState] Reset');
  }

  getState(entityId: string): QuantumStateState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, QuantumStateState> {
    return this.states;
  }
}

export const quantumState = new QuantumState();
export default quantumState;
