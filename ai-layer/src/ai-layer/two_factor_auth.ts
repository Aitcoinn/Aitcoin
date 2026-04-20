import { logger } from '../lib/logger.js';

/**
 * TWO_FACTOR_AUTH — Module #430
 * Two-factor authentication
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface TwoFactorAuthState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TwoFactorAuth {
  private states: Map<string, TwoFactorAuthState> = new Map();

  private getOrCreate(entityId: string): TwoFactorAuthState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TwoFactorAuthState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'two_factor_auth', value: state.value }, '[TwoFactorAuth] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'two_factor_auth' }, '[TwoFactorAuth] Reset');
  }

  getState(entityId: string): TwoFactorAuthState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TwoFactorAuthState> {
    return this.states;
  }
}

export const twoFactorAuth = new TwoFactorAuth();
export default twoFactorAuth;
