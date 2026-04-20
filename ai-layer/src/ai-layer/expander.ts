import { logger } from '../lib/logger.js';

/**
 * EXPANDER — Module #623
 * Text expansion and elaboration
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ExpanderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class Expander {
  private states: Map<string, ExpanderState> = new Map();

  private getOrCreate(entityId: string): ExpanderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ExpanderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'expander', value: state.value }, '[Expander] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'expander' }, '[Expander] Reset');
  }

  getState(entityId: string): ExpanderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ExpanderState> {
    return this.states;
  }
}

export const expander = new Expander();
export default expander;
