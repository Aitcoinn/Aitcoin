import { logger } from '../lib/logger.js';

/**
 * FORCE_APPLIER — Module #796
 * Force application system
 * Kategori: PERSEPSI & REALITAS
 */
export interface ForceApplierState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ForceApplier {
  private states: Map<string, ForceApplierState> = new Map();

  private getOrCreate(entityId: string): ForceApplierState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ForceApplierState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'force_applier', value: state.value }, '[ForceApplier] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'force_applier' }, '[ForceApplier] Reset');
  }

  getState(entityId: string): ForceApplierState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ForceApplierState> {
    return this.states;
  }
}

export const forceApplier = new ForceApplier();
export default forceApplier;
