import { logger } from '../lib/logger.js';

/**
 * RATING_SYSTEM — Module #683
 * Rating and scoring system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface RatingSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RatingSystem {
  private states: Map<string, RatingSystemState> = new Map();

  private getOrCreate(entityId: string): RatingSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RatingSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rating_system', value: state.value }, '[RatingSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rating_system' }, '[RatingSystem] Reset');
  }

  getState(entityId: string): RatingSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RatingSystemState> {
    return this.states;
  }
}

export const ratingSystem = new RatingSystem();
export default ratingSystem;
