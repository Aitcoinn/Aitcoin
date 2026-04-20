import { logger } from '../lib/logger.js';

/**
 * SKIN_SYSTEM — Module #931
 * Skin and texture system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface SkinSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SkinSystem {
  private states: Map<string, SkinSystemState> = new Map();

  private getOrCreate(entityId: string): SkinSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SkinSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'skin_system', value: state.value }, '[SkinSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'skin_system' }, '[SkinSystem] Reset');
  }

  getState(entityId: string): SkinSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SkinSystemState> {
    return this.states;
  }
}

export const skinSystem = new SkinSystem();
export default skinSystem;
