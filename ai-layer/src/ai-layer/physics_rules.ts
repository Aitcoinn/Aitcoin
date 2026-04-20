import { logger } from '../lib/logger.js';

/**
 * PHYSICS_RULES — Module #732
 * Physics rule enforcement
 * Kategori: PERSEPSI & REALITAS
 */
export interface PhysicsRulesState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PhysicsRules {
  private states: Map<string, PhysicsRulesState> = new Map();

  private getOrCreate(entityId: string): PhysicsRulesState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PhysicsRulesState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'physics_rules', value: state.value }, '[PhysicsRules] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'physics_rules' }, '[PhysicsRules] Reset');
  }

  getState(entityId: string): PhysicsRulesState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PhysicsRulesState> {
    return this.states;
  }
}

export const physicsRules = new PhysicsRules();
export default physicsRules;
