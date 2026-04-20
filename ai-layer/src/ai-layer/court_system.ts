import { logger } from '../lib/logger.js';

/**
 * COURT_SYSTEM — Module #814
 * Court and trial system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CourtSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CourtSystem {
  private states: Map<string, CourtSystemState> = new Map();

  private getOrCreate(entityId: string): CourtSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CourtSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'court_system', value: state.value }, '[CourtSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'court_system' }, '[CourtSystem] Reset');
  }

  getState(entityId: string): CourtSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CourtSystemState> {
    return this.states;
  }
}

export const courtSystem = new CourtSystem();
export default courtSystem;
