import { logger } from '../lib/logger.js';

/**
 * INTELLIGENCE_AGENCY — Module #865
 * Intelligence agency simulation
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface IntelligenceAgencyState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class IntelligenceAgency {
  private states: Map<string, IntelligenceAgencyState> = new Map();

  private getOrCreate(entityId: string): IntelligenceAgencyState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): IntelligenceAgencyState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'intelligence_agency', value: state.value }, '[IntelligenceAgency] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'intelligence_agency' }, '[IntelligenceAgency] Reset');
  }

  getState(entityId: string): IntelligenceAgencyState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, IntelligenceAgencyState> {
    return this.states;
  }
}

export const intelligenceAgency = new IntelligenceAgency();
export default intelligenceAgency;
