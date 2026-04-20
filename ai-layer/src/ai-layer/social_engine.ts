import { logger } from '../lib/logger.js';

/**
 * SOCIAL_ENGINE — Module #316
 * Social dynamics and group behavior simulation
 * Kategori: MESIN & SISTEM
 */
export interface SocialEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SocialEngine {
  private states: Map<string, SocialEngineState> = new Map();

  private getOrCreate(entityId: string): SocialEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SocialEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'social_engine', value: state.value }, '[SocialEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'social_engine' }, '[SocialEngine] Reset');
  }

  getState(entityId: string): SocialEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SocialEngineState> {
    return this.states;
  }
}

export const socialEngine = new SocialEngine();
export default socialEngine;
