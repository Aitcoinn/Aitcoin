import { logger } from '../lib/logger.js';

/**
 * FONT_RENDERER — Module #646
 * Font rendering engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface FontRendererState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FontRenderer {
  private states: Map<string, FontRendererState> = new Map();

  private getOrCreate(entityId: string): FontRendererState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FontRendererState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'font_renderer', value: state.value }, '[FontRenderer] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'font_renderer' }, '[FontRenderer] Reset');
  }

  getState(entityId: string): FontRendererState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FontRendererState> {
    return this.states;
  }
}

export const fontRenderer = new FontRenderer();
export default fontRenderer;
