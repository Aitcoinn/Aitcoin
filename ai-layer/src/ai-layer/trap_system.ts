import { logger } from '../lib/logger.js';

/**
 * TRAP_SYSTEM — Module #412
 * Security trap deployment
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface TrapSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TrapSystem {
  private states: Map<string, TrapSystemState> = new Map();

  private getOrCreate(entityId: string): TrapSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TrapSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'trap_system', value: state.value }, '[TrapSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'trap_system' }, '[TrapSystem] Reset');
  }

  getState(entityId: string): TrapSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TrapSystemState> {
    return this.states;
  }
}

export const trapSystem = new TrapSystem();
export default trapSystem;
