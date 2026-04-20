import { logger } from '../lib/logger.js';

/**
 * SEQUENCE_GENERATOR — Module #358
 * Sequence generation and management
 * Kategori: MESIN & SISTEM
 */
export interface SequenceGeneratorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SequenceGenerator {
  private states: Map<string, SequenceGeneratorState> = new Map();

  private getOrCreate(entityId: string): SequenceGeneratorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SequenceGeneratorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sequence_generator', value: state.value }, '[SequenceGenerator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sequence_generator' }, '[SequenceGenerator] Reset');
  }

  getState(entityId: string): SequenceGeneratorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SequenceGeneratorState> {
    return this.states;
  }
}

export const sequenceGenerator = new SequenceGenerator();
export default sequenceGenerator;
