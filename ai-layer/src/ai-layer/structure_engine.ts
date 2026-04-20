import { logger } from '../lib/logger.js';

/**
 * STRUCTURE_ENGINE — Module #334
 * Data structure and organization engine
 * Kategori: MESIN & SISTEM
 */
export interface StructureEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StructureEngine {
  private states: Map<string, StructureEngineState> = new Map();

  private getOrCreate(entityId: string): StructureEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StructureEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'structure_engine', value: state.value }, '[StructureEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'structure_engine' }, '[StructureEngine] Reset');
  }

  getState(entityId: string): StructureEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StructureEngineState> {
    return this.states;
  }
}

export const structureEngine = new StructureEngine();
export default structureEngine;
