import { logger } from '../lib/logger.js';

/**
 * DROP_OBJECT — Module #1671
 * Object dropping system
 * Kategori: LINGKUNGAN & OBJEK FISIK
 */
export interface DropObjectState {
  entityId: string;
  active: boolean;
  level: number;
  intensity: number;
  data: Record<string, unknown>;
  history: string[];
  updatedAt: number;
}

export class DropObject {
  private states: Map<string, DropObjectState> = new Map();

  private getOrCreate(entityId: string): DropObjectState {
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

  activate(entityId: string, intensity = 50): DropObjectState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.level = Math.min(100, state.level + 1);
    state.intensity = Math.max(0, Math.min(100, intensity));
    state.history.push(`activated at ${new Date().toISOString()}`);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'drop_object', intensity }, '[DropObject] Activated');
    return state;
  }

  deactivate(entityId: string): void {
    const state = this.getOrCreate(entityId);
    state.active = false;
    state.intensity = 0;
    state.history.push(`deactivated at ${new Date().toISOString()}`);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'drop_object' }, '[DropObject] Deactivated');
  }

  update(entityId: string, data: Record<string, unknown>): DropObjectState {
    const state = this.getOrCreate(entityId);
    state.data = { ...state.data, ...data };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'drop_object' }, '[DropObject] Updated');
    return state;
  }

  getState(entityId: string): DropObjectState | null {
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
    logger.info({ entityId, module: 'drop_object' }, '[DropObject] Reset');
  }

  getAllActive(): string[] {
    return Array.from(this.states.entries())
      .filter(([, s]) => s.active)
      .map(([id]) => id);
  }
}

export const dropObject = new DropObject();
export default dropObject;
