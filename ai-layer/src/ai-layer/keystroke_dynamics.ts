import { logger } from '../lib/logger.js';

/**
 * KEYSTROKE_DYNAMICS — Module #438
 * Keystroke pattern analysis
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface KeystrokeDynamicsState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class KeystrokeDynamics {
  private states: Map<string, KeystrokeDynamicsState> = new Map();

  private getOrCreate(entityId: string): KeystrokeDynamicsState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): KeystrokeDynamicsState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'keystroke_dynamics', value: state.value }, '[KeystrokeDynamics] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'keystroke_dynamics' }, '[KeystrokeDynamics] Reset');
  }

  getState(entityId: string): KeystrokeDynamicsState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, KeystrokeDynamicsState> {
    return this.states;
  }
}

export const keystrokeDynamics = new KeystrokeDynamics();
export default keystrokeDynamics;
