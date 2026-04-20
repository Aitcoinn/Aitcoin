import { logger } from '../lib/logger.js';

/**
 * SIGN_INTERPRETER — Module #941
 * Sign and omen interpretation
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface SignInterpreterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SignInterpreter {
  private states: Map<string, SignInterpreterState> = new Map();

  private getOrCreate(entityId: string): SignInterpreterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SignInterpreterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sign_interpreter', value: state.value }, '[SignInterpreter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sign_interpreter' }, '[SignInterpreter] Reset');
  }

  getState(entityId: string): SignInterpreterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SignInterpreterState> {
    return this.states;
  }
}

export const signInterpreter = new SignInterpreter();
export default signInterpreter;
