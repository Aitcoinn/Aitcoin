import { logger } from '../lib/logger.js';

/**
 * KNOWLEDGE_SHARE — Module #690
 * Knowledge sharing system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface KnowledgeShareState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class KnowledgeShare {
  private states: Map<string, KnowledgeShareState> = new Map();

  private getOrCreate(entityId: string): KnowledgeShareState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): KnowledgeShareState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'knowledge_share', value: state.value }, '[KnowledgeShare] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'knowledge_share' }, '[KnowledgeShare] Reset');
  }

  getState(entityId: string): KnowledgeShareState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, KnowledgeShareState> {
    return this.states;
  }
}

export const knowledgeShare = new KnowledgeShare();
export default knowledgeShare;
