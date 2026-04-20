import { logger } from '../lib/logger.js';

/**
 * DEFENSE_SYSTEM — Module #401
 * Active defense system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface DefenseSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DefenseSystem {
  private states: Map<string, DefenseSystemState> = new Map();

  private getOrCreate(entityId: string): DefenseSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DefenseSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'defense_system', value: state.value }, '[DefenseSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'defense_system' }, '[DefenseSystem] Reset');
  }

  getState(entityId: string): DefenseSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DefenseSystemState> {
    return this.states;
  }
}

export const defenseSystem = new DefenseSystem();
export default defenseSystem;
