import { logger } from '../lib/logger.js';

/**
 * BADGE_COLLECTOR — Module #829
 * Badge collection system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface BadgeCollectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BadgeCollector {
  private states: Map<string, BadgeCollectorState> = new Map();

  private getOrCreate(entityId: string): BadgeCollectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BadgeCollectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'badge_collector', value: state.value }, '[BadgeCollector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'badge_collector' }, '[BadgeCollector] Reset');
  }

  getState(entityId: string): BadgeCollectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BadgeCollectorState> {
    return this.states;
  }
}

export const badgeCollector = new BadgeCollector();
export default badgeCollector;
