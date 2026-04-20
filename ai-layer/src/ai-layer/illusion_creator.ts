import { logger } from '../lib/logger.js';

/**
 * ILLUSION_CREATOR — Module #744
 * Illusion generation engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface IllusionCreatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IllusionCreator {
  private states: Map<string, IllusionCreatorState> = new Map();

  private getOrCreate(entityId: string): IllusionCreatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IllusionCreatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'illusion_creator', value: state.value }, '[IllusionCreator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'illusion_creator' }, '[IllusionCreator] Reset');
  }

  getState(entityId: string): IllusionCreatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IllusionCreatorState> {
    return this.states;
  }
}

export const illusionCreator = new IllusionCreator();
export default illusionCreator;
