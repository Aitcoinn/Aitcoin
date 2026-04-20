import { logger } from '../lib/logger.js';

/**
 * MAGIC_SYSTEM — Module #916
 * Magical energy management
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface MagicSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MagicSystem {
  private states: Map<string, MagicSystemState> = new Map();

  private getOrCreate(entityId: string): MagicSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MagicSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'magic_system', value: state.value }, '[MagicSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'magic_system' }, '[MagicSystem] Reset');
  }

  getState(entityId: string): MagicSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MagicSystemState> {
    return this.states;
  }
}

export const magicSystem = new MagicSystem();
export default magicSystem;
