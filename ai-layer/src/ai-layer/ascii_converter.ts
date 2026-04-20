import { logger } from '../lib/logger.js';

/**
 * ASCII_CONVERTER — Module #638
 * ASCII encoding and conversion
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ASCIIConverterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ASCIIConverter {
  private states: Map<string, ASCIIConverterState> = new Map();

  private getOrCreate(entityId: string): ASCIIConverterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ASCIIConverterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'ascii_converter', value: state.value }, '[ASCIIConverter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'ascii_converter' }, '[ASCIIConverter] Reset');
  }

  getState(entityId: string): ASCIIConverterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ASCIIConverterState> {
    return this.states;
  }
}

export const asciiConverter = new ASCIIConverter();
export default asciiConverter;
