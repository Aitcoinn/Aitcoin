import { logger } from '../lib/logger.js';

/**
 * CHARSET_MANAGER — Module #642
 * Character set management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface CharsetManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CharsetManager {
  private states: Map<string, CharsetManagerState> = new Map();

  private getOrCreate(entityId: string): CharsetManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CharsetManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'charset_manager', value: state.value }, '[CharsetManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'charset_manager' }, '[CharsetManager] Reset');
  }

  getState(entityId: string): CharsetManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CharsetManagerState> {
    return this.states;
  }
}

export const charsetManager = new CharsetManager();
export default charsetManager;
