import { logger } from '../lib/logger.js';

/**
 * ENVIRONMENT_MAPPER — Module #722
 * Environment mapping system
 * Kategori: PERSEPSI & REALITAS
 */
export interface EnvironmentMapperState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EnvironmentMapper {
  private states: Map<string, EnvironmentMapperState> = new Map();

  private getOrCreate(entityId: string): EnvironmentMapperState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EnvironmentMapperState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'environment_mapper', value: state.value }, '[EnvironmentMapper] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'environment_mapper' }, '[EnvironmentMapper] Reset');
  }

  getState(entityId: string): EnvironmentMapperState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EnvironmentMapperState> {
    return this.states;
  }
}

export const environmentMapper = new EnvironmentMapper();
export default environmentMapper;
