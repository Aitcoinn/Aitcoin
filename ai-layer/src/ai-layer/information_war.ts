import { logger } from '../lib/logger.js';

/**
 * INFORMATION_WAR — Module #867
 * Information warfare system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface InformationWarState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InformationWar {
  private states: Map<string, InformationWarState> = new Map();

  private getOrCreate(entityId: string): InformationWarState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InformationWarState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'information_war', value: state.value }, '[InformationWar] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'information_war' }, '[InformationWar] Reset');
  }

  getState(entityId: string): InformationWarState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InformationWarState> {
    return this.states;
  }
}

export const informationWar = new InformationWar();
export default informationWar;
