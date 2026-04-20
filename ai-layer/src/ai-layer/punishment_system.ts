import { logger } from '../lib/logger.js';

/**
 * PUNISHMENT_SYSTEM — Module #818
 * Punishment and penalty system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface PunishmentSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PunishmentSystem {
  private states: Map<string, PunishmentSystemState> = new Map();

  private getOrCreate(entityId: string): PunishmentSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PunishmentSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'punishment_system', value: state.value }, '[PunishmentSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'punishment_system' }, '[PunishmentSystem] Reset');
  }

  getState(entityId: string): PunishmentSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PunishmentSystemState> {
    return this.states;
  }
}

export const punishmentSystem = new PunishmentSystem();
export default punishmentSystem;
