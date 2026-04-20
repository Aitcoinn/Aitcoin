import { logger } from '../lib/logger.js';

/**
 * CLASS_SYSTEM — Module #839
 * Social class management
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ClassSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ClassSystem {
  private states: Map<string, ClassSystemState> = new Map();

  private getOrCreate(entityId: string): ClassSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ClassSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'class_system', value: state.value }, '[ClassSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'class_system' }, '[ClassSystem] Reset');
  }

  getState(entityId: string): ClassSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ClassSystemState> {
    return this.states;
  }
}

export const classSystem = new ClassSystem();
export default classSystem;
