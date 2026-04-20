import { logger } from '../lib/logger.js';

/**
 * DEFENSE_FORCE — Module #862
 * Defense force management
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface DefenseForceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DefenseForce {
  private states: Map<string, DefenseForceState> = new Map();

  private getOrCreate(entityId: string): DefenseForceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DefenseForceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'defense_force', value: state.value }, '[DefenseForce] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'defense_force' }, '[DefenseForce] Reset');
  }

  getState(entityId: string): DefenseForceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DefenseForceState> {
    return this.states;
  }
}

export const defenseForce = new DefenseForce();
export default defenseForce;
