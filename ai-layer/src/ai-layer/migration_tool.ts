import { logger } from '../lib/logger.js';

/**
 * MIGRATION_TOOL — Module #558
 * Data migration tool
 * Kategori: JARINGAN & KONEKSI
 */
export interface MigrationToolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MigrationTool {
  private states: Map<string, MigrationToolState> = new Map();

  private getOrCreate(entityId: string): MigrationToolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MigrationToolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'migration_tool', value: state.value }, '[MigrationTool] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'migration_tool' }, '[MigrationTool] Reset');
  }

  getState(entityId: string): MigrationToolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MigrationToolState> {
    return this.states;
  }
}

export const migrationTool = new MigrationTool();
export default migrationTool;
