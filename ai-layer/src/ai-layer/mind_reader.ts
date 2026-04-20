import { logger } from '../lib/logger.js';

/**
 * MIND_READER — Module #750
 * Mind state reading system
 * Kategori: PERSEPSI & REALITAS
 */
export interface MindReaderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MindReader {
  private states: Map<string, MindReaderState> = new Map();

  private getOrCreate(entityId: string): MindReaderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MindReaderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mind_reader', value: state.value }, '[MindReader] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'mind_reader' }, '[MindReader] Reset');
  }

  getState(entityId: string): MindReaderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MindReaderState> {
    return this.states;
  }
}

export const mindReader = new MindReader();
export default mindReader;
