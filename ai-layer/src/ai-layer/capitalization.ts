import { logger } from '../lib/logger.js';

/**
 * CAPITALIZATION — Module #666
 * Text capitalization system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface CapitalizationState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class Capitalization {
  private states: Map<string, CapitalizationState> = new Map();

  private getOrCreate(entityId: string): CapitalizationState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CapitalizationState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'capitalization', value: state.value }, '[Capitalization] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'capitalization' }, '[Capitalization] Reset');
  }

  getState(entityId: string): CapitalizationState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CapitalizationState> {
    return this.states;
  }
}

export const capitalization = new Capitalization();
export default capitalization;
