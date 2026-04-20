import { logger } from '../lib/logger.js';

/**
 * DEBATE_SYSTEM — Module #852
 * Structured debate system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface DebateSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DebateSystem {
  private states: Map<string, DebateSystemState> = new Map();

  private getOrCreate(entityId: string): DebateSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DebateSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'debate_system', value: state.value }, '[DebateSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'debate_system' }, '[DebateSystem] Reset');
  }

  getState(entityId: string): DebateSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DebateSystemState> {
    return this.states;
  }
}

export const debateSystem = new DebateSystem();
export default debateSystem;
