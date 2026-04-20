import { logger } from '../lib/logger.js';

/**
 * SOLDIER_AI — Module #861
 * AI soldier unit system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface SoldierAIState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SoldierAI {
  private states: Map<string, SoldierAIState> = new Map();

  private getOrCreate(entityId: string): SoldierAIState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SoldierAIState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'soldier_ai', value: state.value }, '[SoldierAI] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'soldier_ai' }, '[SoldierAI] Reset');
  }

  getState(entityId: string): SoldierAIState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SoldierAIState> {
    return this.states;
  }
}

export const soldierAi = new SoldierAI();
export default soldierAi;
