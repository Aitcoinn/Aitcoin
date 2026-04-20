import { logger } from '../lib/logger.js';

/**
 * MEDIATOR_PATTERN — Module #392
 * Mediator pattern for loose coupling
 * Kategori: MESIN & SISTEM
 */
export interface MediatorPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MediatorPattern {
  private states: Map<string, MediatorPatternState> = new Map();

  private getOrCreate(entityId: string): MediatorPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MediatorPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mediator_pattern', value: state.value }, '[MediatorPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'mediator_pattern' }, '[MediatorPattern] Reset');
  }

  getState(entityId: string): MediatorPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MediatorPatternState> {
    return this.states;
  }
}

export const mediatorPattern = new MediatorPattern();
export default mediatorPattern;
