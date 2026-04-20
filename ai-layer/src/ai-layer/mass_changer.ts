import { logger } from '../lib/logger.js';

/**
 * MASS_CHANGER — Module #792
 * Mass manipulation system
 * Kategori: PERSEPSI & REALITAS
 */
export interface MassChangerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MassChanger {
  private states: Map<string, MassChangerState> = new Map();

  private getOrCreate(entityId: string): MassChangerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MassChangerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mass_changer', value: state.value }, '[MassChanger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'mass_changer' }, '[MassChanger] Reset');
  }

  getState(entityId: string): MassChangerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MassChangerState> {
    return this.states;
  }
}

export const massChanger = new MassChanger();
export default massChanger;
