import { logger } from '../lib/logger.js';

/**
 * SCAM_PREVENTER — Module #453
 * Scam prevention system
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface ScamPreventerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ScamPreventer {
  private states: Map<string, ScamPreventerState> = new Map();

  private getOrCreate(entityId: string): ScamPreventerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ScamPreventerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'scam_preventer', value: state.value }, '[ScamPreventer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'scam_preventer' }, '[ScamPreventer] Reset');
  }

  getState(entityId: string): ScamPreventerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ScamPreventerState> {
    return this.states;
  }
}

export const scamPreventer = new ScamPreventer();
export default scamPreventer;
