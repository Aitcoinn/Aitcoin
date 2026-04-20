import { logger } from '../lib/logger.js';

/**
 * LEVEL_SYSTEM — Module #826
 * Level progression system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface LevelSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LevelSystem {
  private states: Map<string, LevelSystemState> = new Map();

  private getOrCreate(entityId: string): LevelSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LevelSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'level_system', value: state.value }, '[LevelSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'level_system' }, '[LevelSystem] Reset');
  }

  getState(entityId: string): LevelSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LevelSystemState> {
    return this.states;
  }
}

export const levelSystem = new LevelSystem();
export default levelSystem;
