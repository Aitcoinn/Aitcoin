import { logger } from '../lib/logger.js';

/**
 * RUBBER_MAT — Module #1623
 * Rubber material
 * Kategori: LINGKUNGAN & OBJEK FISIK
 */
export interface RubberMatState {
  entityId: string;
  active: boolean;
  level: number;
  intensity: number;
  data: Record<string, unknown>;
  history: string[];
  updatedAt: number;
}

export class RubberMat {
  private states: Map<string, RubberMatState> = new Map();

  private getOrCreate(entityId: string): RubberMatState {
    if (!this.states.has(entityId)) {
      this.states.set(entityId, {
        entityId,
        active: false,
        level: 0,
        intensity: 0,
        data: {},
        history: [],
        updatedAt: Date.now(),
      });
    }
    return this.states.get(entityId)!;
  }

  activate(entityId: string, intensity = 50): RubberMatState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.level = Math.min(100, state.level + 1);
    state.intensity = Math.max(0, Math.min(100, intensity));
    state.history.push(`activated at ${new Date().toISOString()}`);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rubber_mat', intensity }, '[RubberMat] Activated');
    return state;
  }

  deactivate(entityId: string): void {
    const state = this.getOrCreate(entityId);
    state.active = false;
    state.intensity = 0;
    state.history.push(`deactivated at ${new Date().toISOString()}`);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rubber_mat' }, '[RubberMat] Deactivated');
  }

  update(entityId: string, data: Record<string, unknown>): RubberMatState {
    const state = this.getOrCreate(entityId);
    state.data = { ...state.data, ...data };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rubber_mat' }, '[RubberMat] Updated');
    return state;
  }

  getState(entityId: string): RubberMatState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getLevel(entityId: string): number {
    return this.states.get(entityId)?.level ?? 0;
  }

  getIntensity(entityId: string): number {
    return this.states.get(entityId)?.intensity ?? 0;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rubber_mat' }, '[RubberMat] Reset');
  }

  getAllActive(): string[] {
    return Array.from(this.states.entries())
      .filter(([, s]) => s.active)
      .map(([id]) => id);
  }
}

export const rubberMat = new RubberMat();
export default rubberMat;
