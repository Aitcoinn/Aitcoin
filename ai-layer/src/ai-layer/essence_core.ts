import { logger } from '../lib/logger.js';

/**
 * ESSENCE_CORE — Module #982
 * Core essence management
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface EssenceCoreState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EssenceCore {
  private states: Map<string, EssenceCoreState> = new Map();

  private getOrCreate(entityId: string): EssenceCoreState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EssenceCoreState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'essence_core', value: state.value }, '[EssenceCore] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'essence_core' }, '[EssenceCore] Reset');
  }

  getState(entityId: string): EssenceCoreState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EssenceCoreState> {
    return this.states;
  }
}

export const essenceCore = new EssenceCore();
export default essenceCore;
