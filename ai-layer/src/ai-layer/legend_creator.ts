import { logger } from '../lib/logger.js';

/**
 * LEGEND_CREATOR — Module #990
 * Legend creation system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface LegendCreatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LegendCreator {
  private states: Map<string, LegendCreatorState> = new Map();

  private getOrCreate(entityId: string): LegendCreatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LegendCreatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'legend_creator', value: state.value }, '[LegendCreator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'legend_creator' }, '[LegendCreator] Reset');
  }

  getState(entityId: string): LegendCreatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LegendCreatorState> {
    return this.states;
  }
}

export const legendCreator = new LegendCreator();
export default legendCreator;
