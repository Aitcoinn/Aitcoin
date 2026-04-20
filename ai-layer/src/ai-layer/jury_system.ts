import { logger } from '../lib/logger.js';

/**
 * JURY_SYSTEM — Module #816
 * Jury deliberation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface JurySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class JurySystem {
  private states: Map<string, JurySystemState> = new Map();

  private getOrCreate(entityId: string): JurySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): JurySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'jury_system', value: state.value }, '[JurySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'jury_system' }, '[JurySystem] Reset');
  }

  getState(entityId: string): JurySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, JurySystemState> {
    return this.states;
  }
}

export const jurySystem = new JurySystem();
export default jurySystem;
