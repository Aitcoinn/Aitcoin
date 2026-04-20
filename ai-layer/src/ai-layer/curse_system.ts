import { logger } from '../lib/logger.js';

/**
 * CURSE_SYSTEM — Module #920
 * Curse management system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface CurseSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CurseSystem {
  private states: Map<string, CurseSystemState> = new Map();

  private getOrCreate(entityId: string): CurseSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CurseSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'curse_system', value: state.value }, '[CurseSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'curse_system' }, '[CurseSystem] Reset');
  }

  getState(entityId: string): CurseSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CurseSystemState> {
    return this.states;
  }
}

export const curseSystem = new CurseSystem();
export default curseSystem;
