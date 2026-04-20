import { logger } from '../lib/logger.js';

/**
 * OATH_SYSTEM — Module #892
 * Oath taking and tracking
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface OathSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OathSystem {
  private states: Map<string, OathSystemState> = new Map();

  private getOrCreate(entityId: string): OathSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OathSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'oath_system', value: state.value }, '[OathSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'oath_system' }, '[OathSystem] Reset');
  }

  getState(entityId: string): OathSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OathSystemState> {
    return this.states;
  }
}

export const oathSystem = new OathSystem();
export default oathSystem;
