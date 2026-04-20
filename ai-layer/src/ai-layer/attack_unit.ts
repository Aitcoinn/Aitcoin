import { logger } from '../lib/logger.js';

/**
 * ATTACK_UNIT — Module #863
 * Attack unit management
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface AttackUnitState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AttackUnit {
  private states: Map<string, AttackUnitState> = new Map();

  private getOrCreate(entityId: string): AttackUnitState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AttackUnitState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'attack_unit', value: state.value }, '[AttackUnit] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'attack_unit' }, '[AttackUnit] Reset');
  }

  getState(entityId: string): AttackUnitState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AttackUnitState> {
    return this.states;
  }
}

export const attackUnit = new AttackUnit();
export default attackUnit;
