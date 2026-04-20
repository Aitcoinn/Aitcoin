import { logger } from '../lib/logger.js';

/**
 * CODE_HIDER — Module #468
 * Code hiding and protection
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface CodeHiderState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CodeHider {
  private states: Map<string, CodeHiderState> = new Map();

  private getOrCreate(entityId: string): CodeHiderState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CodeHiderState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'code_hider', value: state.value }, '[CodeHider] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'code_hider' }, '[CodeHider] Reset');
  }

  getState(entityId: string): CodeHiderState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CodeHiderState> {
    return this.states;
  }
}

export const codeHider = new CodeHider();
export default codeHider;
