import { logger } from '../lib/logger.js';

/**
 * RANDOMNESS_CONTROL — Module #764
 * Randomness control system
 * Kategori: PERSEPSI & REALITAS
 */
export interface RandomnessControlState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RandomnessControl {
  private states: Map<string, RandomnessControlState> = new Map();

  private getOrCreate(entityId: string): RandomnessControlState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RandomnessControlState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'randomness_control', value: state.value }, '[RandomnessControl] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'randomness_control' }, '[RandomnessControl] Reset');
  }

  getState(entityId: string): RandomnessControlState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RandomnessControlState> {
    return this.states;
  }
}

export const randomnessControl = new RandomnessControl();
export default randomnessControl;
