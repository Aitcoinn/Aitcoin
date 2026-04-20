import { logger } from '../lib/logger.js';

/**
 * WORLD_GENERATOR — Module #730
 * World generation engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface WorldGeneratorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WorldGenerator {
  private states: Map<string, WorldGeneratorState> = new Map();

  private getOrCreate(entityId: string): WorldGeneratorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WorldGeneratorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'world_generator', value: state.value }, '[WorldGenerator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'world_generator' }, '[WorldGenerator] Reset');
  }

  getState(entityId: string): WorldGeneratorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WorldGeneratorState> {
    return this.states;
  }
}

export const worldGenerator = new WorldGenerator();
export default worldGenerator;
