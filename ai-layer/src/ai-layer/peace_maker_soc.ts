import { logger } from '../lib/logger.js';

/**
 * PEACE_MAKER_SOC — Module #855
 * Peace negotiation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface PeaceMakerSocState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PeaceMakerSoc {
  private states: Map<string, PeaceMakerSocState> = new Map();

  private getOrCreate(entityId: string): PeaceMakerSocState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PeaceMakerSocState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'peace_maker_soc', value: state.value }, '[PeaceMakerSoc] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'peace_maker_soc' }, '[PeaceMakerSoc] Reset');
  }

  getState(entityId: string): PeaceMakerSocState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PeaceMakerSocState> {
    return this.states;
  }
}

export const peaceMakerSoc = new PeaceMakerSoc();
export default peaceMakerSoc;
