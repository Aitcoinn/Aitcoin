import { logger } from '../lib/logger.js';

/**
 * REALITY_SHIFTER — Module #741
 * Reality shifting mechanism
 * Kategori: PERSEPSI & REALITAS
 */
export interface RealityShifterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RealityShifter {
  private states: Map<string, RealityShifterState> = new Map();

  private getOrCreate(entityId: string): RealityShifterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RealityShifterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'reality_shifter', value: state.value }, '[RealityShifter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'reality_shifter' }, '[RealityShifter] Reset');
  }

  getState(entityId: string): RealityShifterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RealityShifterState> {
    return this.states;
  }
}

export const realityShifter = new RealityShifter();
export default realityShifter;
