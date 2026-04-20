import { logger } from '../lib/logger.js';

/**
 * STYLE_GUIDE — Module #668
 * Language style guide system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface StyleGuideState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class StyleGuide {
  private states: Map<string, StyleGuideState> = new Map();

  private getOrCreate(entityId: string): StyleGuideState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): StyleGuideState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'style_guide', value: state.value }, '[StyleGuide] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'style_guide' }, '[StyleGuide] Reset');
  }

  getState(entityId: string): StyleGuideState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, StyleGuideState> {
    return this.states;
  }
}

export const styleGuide = new StyleGuide();
export default styleGuide;
