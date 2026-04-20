import { logger } from '../lib/logger.js';

/**
 * DREAM_GENERATOR — Module #746
 * Dream state generation
 * Kategori: PERSEPSI & REALITAS
 */
export interface DreamGeneratorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DreamGenerator {
  private states: Map<string, DreamGeneratorState> = new Map();

  private getOrCreate(entityId: string): DreamGeneratorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DreamGeneratorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'dream_generator', value: state.value }, '[DreamGenerator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'dream_generator' }, '[DreamGenerator] Reset');
  }

  getState(entityId: string): DreamGeneratorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DreamGeneratorState> {
    return this.states;
  }
}

export const dreamGenerator = new DreamGenerator();
export default dreamGenerator;
