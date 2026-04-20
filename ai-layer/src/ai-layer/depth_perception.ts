import { logger } from '../lib/logger.js';

/**
 * DEPTH_PERCEPTION — Module #712
 * Depth perception engine
 * Kategori: PERSEPSI & REALITAS
 */
export interface DepthPerceptionState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DepthPerception {
  private states: Map<string, DepthPerceptionState> = new Map();

  private getOrCreate(entityId: string): DepthPerceptionState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DepthPerceptionState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'depth_perception', value: state.value }, '[DepthPerception] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'depth_perception' }, '[DepthPerception] Reset');
  }

  getState(entityId: string): DepthPerceptionState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DepthPerceptionState> {
    return this.states;
  }
}

export const depthPerception = new DepthPerception();
export default depthPerception;
