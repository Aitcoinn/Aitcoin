import { logger } from '../lib/logger.js';

/**
 * SPACE_PERCEPTION — Module #723
 * Spatial perception system
 * Kategori: PERSEPSI & REALITAS
 */
export interface SpacePerceptionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpacePerception {
  private states: Map<string, SpacePerceptionState> = new Map();

  private getOrCreate(entityId: string): SpacePerceptionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpacePerceptionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'space_perception', value: state.value }, '[SpacePerception] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'space_perception' }, '[SpacePerception] Reset');
  }

  getState(entityId: string): SpacePerceptionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpacePerceptionState> {
    return this.states;
  }
}

export const spacePerception = new SpacePerception();
export default spacePerception;
