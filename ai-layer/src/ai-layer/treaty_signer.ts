import { logger } from '../lib/logger.js';

/**
 * TREATY_SIGNER — Module #888
 * Treaty signing system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface TreatySignerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TreatySigner {
  private states: Map<string, TreatySignerState> = new Map();

  private getOrCreate(entityId: string): TreatySignerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TreatySignerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'treaty_signer', value: state.value }, '[TreatySigner] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'treaty_signer' }, '[TreatySigner] Reset');
  }

  getState(entityId: string): TreatySignerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TreatySignerState> {
    return this.states;
  }
}

export const treatySigner = new TreatySigner();
export default treatySigner;
