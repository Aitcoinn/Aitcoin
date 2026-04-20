import { logger } from '../lib/logger.js';

/**
 * OPINION_SHARE — Module #851
 * Opinion sharing platform
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface OpinionShareState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class OpinionShare {
  private states: Map<string, OpinionShareState> = new Map();

  private getOrCreate(entityId: string): OpinionShareState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): OpinionShareState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'opinion_share', value: state.value }, '[OpinionShare] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'opinion_share' }, '[OpinionShare] Reset');
  }

  getState(entityId: string): OpinionShareState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, OpinionShareState> {
    return this.states;
  }
}

export const opinionShare = new OpinionShare();
export default opinionShare;
