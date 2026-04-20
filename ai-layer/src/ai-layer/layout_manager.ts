import { logger } from '../lib/logger.js';

/**
 * LAYOUT_MANAGER — Module #648
 * Text layout management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface LayoutManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LayoutManager {
  private states: Map<string, LayoutManagerState> = new Map();

  private getOrCreate(entityId: string): LayoutManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LayoutManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'layout_manager', value: state.value }, '[LayoutManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'layout_manager' }, '[LayoutManager] Reset');
  }

  getState(entityId: string): LayoutManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LayoutManagerState> {
    return this.states;
  }
}

export const layoutManager = new LayoutManager();
export default layoutManager;
