import { logger } from '../lib/logger.js';

/**
 * CHAIN_OF_RESPONSIBILITY — Module #396
 * Request handling chain
 * Kategori: MESIN & SISTEM
 */
export interface ChainOfResponsibilityState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChainOfResponsibility {
  private states: Map<string, ChainOfResponsibilityState> = new Map();

  private getOrCreate(entityId: string): ChainOfResponsibilityState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChainOfResponsibilityState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'chain_of_responsibility', value: state.value }, '[ChainOfResponsibility] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'chain_of_responsibility' }, '[ChainOfResponsibility] Reset');
  }

  getState(entityId: string): ChainOfResponsibilityState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChainOfResponsibilityState> {
    return this.states;
  }
}

export const chainOfResponsibility = new ChainOfResponsibility();
export default chainOfResponsibility;
