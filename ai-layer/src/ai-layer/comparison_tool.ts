import { logger } from '../lib/logger.js';

/**
 * COMPARISON_TOOL — Module #618
 * Comparative analysis tool
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ComparisonToolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ComparisonTool {
  private states: Map<string, ComparisonToolState> = new Map();

  private getOrCreate(entityId: string): ComparisonToolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ComparisonToolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'comparison_tool', value: state.value }, '[ComparisonTool] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'comparison_tool' }, '[ComparisonTool] Reset');
  }

  getState(entityId: string): ComparisonToolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ComparisonToolState> {
    return this.states;
  }
}

export const comparisonTool = new ComparisonTool();
export default comparisonTool;
