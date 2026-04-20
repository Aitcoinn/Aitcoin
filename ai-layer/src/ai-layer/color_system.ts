import { logger } from '../lib/logger.js';

/**
 * COLOR_SYSTEM — Module #715
 * Color perception and management
 * Kategori: PERSEPSI & REALITAS
 */
export interface ColorSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ColorSystem {
  private states: Map<string, ColorSystemState> = new Map();

  private getOrCreate(entityId: string): ColorSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ColorSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'color_system', value: state.value }, '[ColorSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'color_system' }, '[ColorSystem] Reset');
  }

  getState(entityId: string): ColorSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ColorSystemState> {
    return this.states;
  }
}

export const colorSystem = new ColorSystem();
export default colorSystem;
