import { logger } from '../lib/logger.js';

/**
 * REVISION_SYSTEM — Module #553
 * Document revision management
 * Kategori: JARINGAN & KONEKSI
 */
export interface RevisionSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RevisionSystem {
  private states: Map<string, RevisionSystemState> = new Map();

  private getOrCreate(entityId: string): RevisionSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RevisionSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'revision_system', value: state.value }, '[RevisionSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'revision_system' }, '[RevisionSystem] Reset');
  }

  getState(entityId: string): RevisionSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RevisionSystemState> {
    return this.states;
  }
}

export const revisionSystem = new RevisionSystem();
export default revisionSystem;
