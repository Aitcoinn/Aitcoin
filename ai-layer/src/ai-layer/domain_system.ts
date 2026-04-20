import { logger } from '../lib/logger.js';

/**
 * DOMAIN_SYSTEM — Module #575
 * Domain management system
 * Kategori: JARINGAN & KONEKSI
 */
export interface DomainSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DomainSystem {
  private states: Map<string, DomainSystemState> = new Map();

  private getOrCreate(entityId: string): DomainSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DomainSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'domain_system', value: state.value }, '[DomainSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'domain_system' }, '[DomainSystem] Reset');
  }

  getState(entityId: string): DomainSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DomainSystemState> {
    return this.states;
  }
}

export const domainSystem = new DomainSystem();
export default domainSystem;
