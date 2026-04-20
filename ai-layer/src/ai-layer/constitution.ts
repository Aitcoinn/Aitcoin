import { logger } from '../lib/logger.js';

/**
 * CONSTITUTION — Module #809
 * Constitutional law system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ConstitutionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class Constitution {
  private states: Map<string, ConstitutionState> = new Map();

  private getOrCreate(entityId: string): ConstitutionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ConstitutionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'constitution', value: state.value }, '[Constitution] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'constitution' }, '[Constitution] Reset');
  }

  getState(entityId: string): ConstitutionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ConstitutionState> {
    return this.states;
  }
}

export const constitution = new Constitution();
export default constitution;
