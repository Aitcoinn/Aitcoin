import { logger } from '../lib/logger.js';

/**
 * EXPERIENCE_SHARE — Module #691
 * Experience sharing engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ExperienceShareState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ExperienceShare {
  private states: Map<string, ExperienceShareState> = new Map();

  private getOrCreate(entityId: string): ExperienceShareState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ExperienceShareState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'experience_share', value: state.value }, '[ExperienceShare] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'experience_share' }, '[ExperienceShare] Reset');
  }

  getState(entityId: string): ExperienceShareState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ExperienceShareState> {
    return this.states;
  }
}

export const experienceShare = new ExperienceShare();
export default experienceShare;
