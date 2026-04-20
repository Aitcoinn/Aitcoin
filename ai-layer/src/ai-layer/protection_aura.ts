import { logger } from '../lib/logger.js';

/**
 * PROTECTION_AURA — Module #922
 * Protective aura system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface ProtectionAuraState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ProtectionAura {
  private states: Map<string, ProtectionAuraState> = new Map();

  private getOrCreate(entityId: string): ProtectionAuraState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ProtectionAuraState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'protection_aura', value: state.value }, '[ProtectionAura] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'protection_aura' }, '[ProtectionAura] Reset');
  }

  getState(entityId: string): ProtectionAuraState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ProtectionAuraState> {
    return this.states;
  }
}

export const protectionAura = new ProtectionAura();
export default protectionAura;
