import { logger } from '../lib/logger.js';

/**
 * APPRENTICE_SYSTEM — Module #847
 * Apprentice learning system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ApprenticeSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ApprenticeSystem {
  private states: Map<string, ApprenticeSystemState> = new Map();

  private getOrCreate(entityId: string): ApprenticeSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ApprenticeSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'apprentice_system', value: state.value }, '[ApprenticeSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'apprentice_system' }, '[ApprenticeSystem] Reset');
  }

  getState(entityId: string): ApprenticeSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ApprenticeSystemState> {
    return this.states;
  }
}

export const apprenticeSystem = new ApprenticeSystem();
export default apprenticeSystem;
