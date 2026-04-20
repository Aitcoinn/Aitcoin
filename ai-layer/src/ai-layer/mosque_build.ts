import { logger } from '../lib/logger.js';

/**
 * MOSQUE_BUILD — Module #1748
 * Mosque building system
 * Kategori: BANGUNAN & STRUKTUR
 */
export interface MosqueBuildState {
  entityId: string;
  active: boolean;
  level: number;
  intensity: number;
  data: Record<string, unknown>;
  history: string[];
  updatedAt: number;
}

export class MosqueBuild {
  private states: Map<string, MosqueBuildState> = new Map();

  private getOrCreate(entityId: string): MosqueBuildState {
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

  activate(entityId: string, intensity = 50): MosqueBuildState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.level = Math.min(100, state.level + 1);
    state.intensity = Math.max(0, Math.min(100, intensity));
    state.history.push(`activated at ${new Date().toISOString()}`);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mosque_build', intensity }, '[MosqueBuild] Activated');
    return state;
  }

  deactivate(entityId: string): void {
    const state = this.getOrCreate(entityId);
    state.active = false;
    state.intensity = 0;
    state.history.push(`deactivated at ${new Date().toISOString()}`);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mosque_build' }, '[MosqueBuild] Deactivated');
  }

  update(entityId: string, data: Record<string, unknown>): MosqueBuildState {
    const state = this.getOrCreate(entityId);
    state.data = { ...state.data, ...data };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'mosque_build' }, '[MosqueBuild] Updated');
    return state;
  }

  getState(entityId: string): MosqueBuildState | null {
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
    logger.info({ entityId, module: 'mosque_build' }, '[MosqueBuild] Reset');
  }

  getAllActive(): string[] {
    return Array.from(this.states.entries())
      .filter(([, s]) => s.active)
      .map(([id]) => id);
  }
}

export const mosqueBuild = new MosqueBuild();
export default mosqueBuild;
