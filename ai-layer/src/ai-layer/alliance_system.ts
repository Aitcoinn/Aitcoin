import { logger } from '../lib/logger.js';

/**
 * ALLIANCE_SYSTEM — Module #887
 * Alliance formation system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface AllianceSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AllianceSystem {
  private states: Map<string, AllianceSystemState> = new Map();

  private getOrCreate(entityId: string): AllianceSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AllianceSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'alliance_system', value: state.value }, '[AllianceSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'alliance_system' }, '[AllianceSystem] Reset');
  }

  getState(entityId: string): AllianceSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AllianceSystemState> {
    return this.states;
  }
}

export const allianceSystem = new AllianceSystem();
export default allianceSystem;
