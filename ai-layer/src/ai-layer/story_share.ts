import { logger } from '../lib/logger.js';

/**
 * STORY_SHARE — Module #692
 * Story sharing system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface StoryShareState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StoryShare {
  private states: Map<string, StoryShareState> = new Map();

  private getOrCreate(entityId: string): StoryShareState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StoryShareState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'story_share', value: state.value }, '[StoryShare] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'story_share' }, '[StoryShare] Reset');
  }

  getState(entityId: string): StoryShareState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StoryShareState> {
    return this.states;
  }
}

export const storyShare = new StoryShare();
export default storyShare;
