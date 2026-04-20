import { logger } from '../lib/logger.js';

/**
 * CEREMONY_MAKER — Module #807
 * Ceremony creation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CeremonyMakerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CeremonyMaker {
  private states: Map<string, CeremonyMakerState> = new Map();

  private getOrCreate(entityId: string): CeremonyMakerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CeremonyMakerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ceremony_maker', value: state.value }, '[CeremonyMaker] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ceremony_maker' }, '[CeremonyMaker] Reset');
  }

  getState(entityId: string): CeremonyMakerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CeremonyMakerState> {
    return this.states;
  }
}

export const ceremonyMaker = new CeremonyMaker();
export default ceremonyMaker;
