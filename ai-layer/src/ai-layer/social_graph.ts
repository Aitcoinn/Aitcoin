import { logger } from '../lib/logger.js';

/**
 * SOCIAL_GRAPH — Module #584
 * Social graph management
 * Kategori: JARINGAN & KONEKSI
 */
export interface SocialGraphState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SocialGraph {
  private states: Map<string, SocialGraphState> = new Map();

  private getOrCreate(entityId: string): SocialGraphState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SocialGraphState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'social_graph', value: state.value }, '[SocialGraph] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'social_graph' }, '[SocialGraph] Reset');
  }

  getState(entityId: string): SocialGraphState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SocialGraphState> {
    return this.states;
  }
}

export const socialGraph = new SocialGraph();
export default socialGraph;
