import { logger } from '../lib/logger.js';

/**
 * OMEN_READER — Module #942
 * Omen reading system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface OmenReaderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OmenReader {
  private states: Map<string, OmenReaderState> = new Map();

  private getOrCreate(entityId: string): OmenReaderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OmenReaderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'omen_reader', value: state.value }, '[OmenReader] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'omen_reader' }, '[OmenReader] Reset');
  }

  getState(entityId: string): OmenReaderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OmenReaderState> {
    return this.states;
  }
}

export const omenReader = new OmenReader();
export default omenReader;
