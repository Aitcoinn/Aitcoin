import { logger } from '../lib/logger.js';

/**
 * NATION_BUILDER — Module #801
 * Nation building simulation
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface NationBuilderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NationBuilder {
  private states: Map<string, NationBuilderState> = new Map();

  private getOrCreate(entityId: string): NationBuilderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NationBuilderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'nation_builder', value: state.value }, '[NationBuilder] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'nation_builder' }, '[NationBuilder] Reset');
  }

  getState(entityId: string): NationBuilderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NationBuilderState> {
    return this.states;
  }
}

export const nationBuilder = new NationBuilder();
export default nationBuilder;
