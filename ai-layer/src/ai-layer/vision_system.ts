import { logger } from '../lib/logger.js';

/**
 * VISION_SYSTEM — Module #704
 * Visual perception system
 * Kategori: PERSEPSI & REALITAS
 */
export interface VisionSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class VisionSystem {
  private states: Map<string, VisionSystemState> = new Map();

  private getOrCreate(entityId: string): VisionSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): VisionSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'vision_system', value: state.value }, '[VisionSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'vision_system' }, '[VisionSystem] Reset');
  }

  getState(entityId: string): VisionSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, VisionSystemState> {
    return this.states;
  }
}

export const visionSystem = new VisionSystem();
export default visionSystem;
