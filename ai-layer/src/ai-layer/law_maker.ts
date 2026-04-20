import { logger } from '../lib/logger.js';

/**
 * LAW_MAKER — Module #808
 * Law creation and enforcement
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface LawMakerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LawMaker {
  private states: Map<string, LawMakerState> = new Map();

  private getOrCreate(entityId: string): LawMakerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LawMakerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'law_maker', value: state.value }, '[LawMaker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'law_maker' }, '[LawMaker] Reset');
  }

  getState(entityId: string): LawMakerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LawMakerState> {
    return this.states;
  }
}

export const lawMaker = new LawMaker();
export default lawMaker;
