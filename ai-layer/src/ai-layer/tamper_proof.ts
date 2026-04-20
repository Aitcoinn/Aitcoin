import { logger } from '../lib/logger.js';

/**
 * TAMPER_PROOF — Module #471
 * Tamper detection and prevention
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface TamperProofState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TamperProof {
  private states: Map<string, TamperProofState> = new Map();

  private getOrCreate(entityId: string): TamperProofState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TamperProofState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'tamper_proof', value: state.value }, '[TamperProof] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'tamper_proof' }, '[TamperProof] Reset');
  }

  getState(entityId: string): TamperProofState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TamperProofState> {
    return this.states;
  }
}

export const tamperProof = new TamperProof();
export default tamperProof;
