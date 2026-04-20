import { logger } from '../lib/logger.js';

/**
 * SCENE_UNDERSTANDING — Module #721
 * Scene comprehension system
 * Kategori: PERSEPSI & REALITAS
 */
export interface SceneUnderstandingState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SceneUnderstanding {
  private states: Map<string, SceneUnderstandingState> = new Map();

  private getOrCreate(entityId: string): SceneUnderstandingState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SceneUnderstandingState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'scene_understanding', value: state.value }, '[SceneUnderstanding] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'scene_understanding' }, '[SceneUnderstanding] Reset');
  }

  getState(entityId: string): SceneUnderstandingState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SceneUnderstandingState> {
    return this.states;
  }
}

export const sceneUnderstanding = new SceneUnderstanding();
export default sceneUnderstanding;
