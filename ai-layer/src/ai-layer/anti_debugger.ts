import { logger } from '../lib/logger.js';

/**
 * ANTI_DEBUGGER — Module #469
 * Anti-debugging protection
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface AntiDebuggerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AntiDebugger {
  private states: Map<string, AntiDebuggerState> = new Map();

  private getOrCreate(entityId: string): AntiDebuggerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AntiDebuggerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'anti_debugger', value: state.value }, '[AntiDebugger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'anti_debugger' }, '[AntiDebugger] Reset');
  }

  getState(entityId: string): AntiDebuggerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AntiDebuggerState> {
    return this.states;
  }
}

export const antiDebugger = new AntiDebugger();
export default antiDebugger;
