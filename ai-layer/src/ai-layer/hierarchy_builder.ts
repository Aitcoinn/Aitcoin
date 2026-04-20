import { logger } from '../lib/logger.js';

/**
 * HIERARCHY_BUILDER — Module #838
 * Organizational hierarchy builder
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface HierarchyBuilderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HierarchyBuilder {
  private states: Map<string, HierarchyBuilderState> = new Map();

  private getOrCreate(entityId: string): HierarchyBuilderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HierarchyBuilderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'hierarchy_builder', value: state.value }, '[HierarchyBuilder] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'hierarchy_builder' }, '[HierarchyBuilder] Reset');
  }

  getState(entityId: string): HierarchyBuilderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HierarchyBuilderState> {
    return this.states;
  }
}

export const hierarchyBuilder = new HierarchyBuilder();
export default hierarchyBuilder;
