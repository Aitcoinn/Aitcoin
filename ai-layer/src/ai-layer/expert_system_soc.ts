import { logger } from '../lib/logger.js';

/**
 * EXPERT_SYSTEM_SOC — Module #845
 * Expert knowledge system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface ExpertSystemSocState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ExpertSystemSoc {
  private states: Map<string, ExpertSystemSocState> = new Map();

  private getOrCreate(entityId: string): ExpertSystemSocState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ExpertSystemSocState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'expert_system_soc', value: state.value }, '[ExpertSystemSoc] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'expert_system_soc' }, '[ExpertSystemSoc] Reset');
  }

  getState(entityId: string): ExpertSystemSocState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ExpertSystemSocState> {
    return this.states;
  }
}

export const expertSystemSoc = new ExpertSystemSoc();
export default expertSystemSoc;
