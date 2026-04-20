import { logger } from '../lib/logger.js';

/**
 * PHYSICS_ENGINE — Module #313
 * Simulates physical laws and forces
 * Kategori: MESIN & SISTEM
 */
export interface PhysicsEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PhysicsEngine {
  private states: Map<string, PhysicsEngineState> = new Map();

  private getOrCreate(entityId: string): PhysicsEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PhysicsEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'physics_engine', value: state.value }, '[PhysicsEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'physics_engine' }, '[PhysicsEngine] Reset');
  }

  getState(entityId: string): PhysicsEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PhysicsEngineState> {
    return this.states;
  }
}

export const physicsEngine = new PhysicsEngine();
export default physicsEngine;
