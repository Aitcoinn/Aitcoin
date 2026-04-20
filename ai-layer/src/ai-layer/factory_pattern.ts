import { logger } from '../lib/logger.js';

/**
 * FACTORY_PATTERN — Module #384
 * Factory-based object creation
 * Kategori: MESIN & SISTEM
 */
export interface FactoryPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FactoryPattern {
  private states: Map<string, FactoryPatternState> = new Map();

  private getOrCreate(entityId: string): FactoryPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FactoryPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'factory_pattern', value: state.value }, '[FactoryPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'factory_pattern' }, '[FactoryPattern] Reset');
  }

  getState(entityId: string): FactoryPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FactoryPatternState> {
    return this.states;
  }
}

export const factoryPattern = new FactoryPattern();
export default factoryPattern;
