import { logger } from '../lib/logger.js';

/**
 * INFORMATION_SUPERHIGHWAY — Module #589
 * Information superhighway system
 * Kategori: JARINGAN & KONEKSI
 */
export interface InformationSuperhighwayState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InformationSuperhighway {
  private states: Map<string, InformationSuperhighwayState> = new Map();

  private getOrCreate(entityId: string): InformationSuperhighwayState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InformationSuperhighwayState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'information_superhighway', value: state.value }, '[InformationSuperhighway] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'information_superhighway' }, '[InformationSuperhighway] Reset');
  }

  getState(entityId: string): InformationSuperhighwayState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InformationSuperhighwayState> {
    return this.states;
  }
}

export const informationSuperhighway = new InformationSuperhighway();
export default informationSuperhighway;
