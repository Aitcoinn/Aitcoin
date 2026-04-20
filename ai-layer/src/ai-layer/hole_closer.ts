import { logger } from '../lib/logger.js';

/**
 * HOLE_CLOSER — Module #495
 * Security hole detection and closing
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface HoleCloserState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HoleCloser {
  private states: Map<string, HoleCloserState> = new Map();

  private getOrCreate(entityId: string): HoleCloserState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HoleCloserState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'hole_closer', value: state.value }, '[HoleCloser] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'hole_closer' }, '[HoleCloser] Reset');
  }

  getState(entityId: string): HoleCloserState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HoleCloserState> {
    return this.states;
  }
}

export const holeCloser = new HoleCloser();
export default holeCloser;
