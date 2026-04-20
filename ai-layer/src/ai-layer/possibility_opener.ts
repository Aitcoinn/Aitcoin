import { logger } from '../lib/logger.js';

/**
 * POSSIBILITY_OPENER — Module #786
 * Possibility space opener
 * Kategori: PERSEPSI & REALITAS
 */
export interface PossibilityOpenerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PossibilityOpener {
  private states: Map<string, PossibilityOpenerState> = new Map();

  private getOrCreate(entityId: string): PossibilityOpenerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PossibilityOpenerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'possibility_opener', value: state.value }, '[PossibilityOpener] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'possibility_opener' }, '[PossibilityOpener] Reset');
  }

  getState(entityId: string): PossibilityOpenerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PossibilityOpenerState> {
    return this.states;
  }
}

export const possibilityOpener = new PossibilityOpener();
export default possibilityOpener;
