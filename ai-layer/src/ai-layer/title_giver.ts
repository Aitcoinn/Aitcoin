import { logger } from '../lib/logger.js';

/**
 * TITLE_GIVER — Module #827
 * Title and rank assignment
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface TitleGiverState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TitleGiver {
  private states: Map<string, TitleGiverState> = new Map();

  private getOrCreate(entityId: string): TitleGiverState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TitleGiverState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'title_giver', value: state.value }, '[TitleGiver] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'title_giver' }, '[TitleGiver] Reset');
  }

  getState(entityId: string): TitleGiverState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TitleGiverState> {
    return this.states;
  }
}

export const titleGiver = new TitleGiver();
export default titleGiver;
