import { logger } from '../lib/logger.js';

/**
 * TELEPATHY_SYSTEM — Module #751
 * Telepathic communication system
 * Kategori: PERSEPSI & REALITAS
 */
export interface TelepathySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TelepathySystem {
  private states: Map<string, TelepathySystemState> = new Map();

  private getOrCreate(entityId: string): TelepathySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TelepathySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'telepathy_system', value: state.value }, '[TelepathySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'telepathy_system' }, '[TelepathySystem] Reset');
  }

  getState(entityId: string): TelepathySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TelepathySystemState> {
    return this.states;
  }
}

export const telepathySystem = new TelepathySystem();
export default telepathySystem;
