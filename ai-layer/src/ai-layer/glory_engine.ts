import { logger } from '../lib/logger.js';

/**
 * GLORY_ENGINE — Module #822
 * Glory achievement engine
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface GloryEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GloryEngine {
  private states: Map<string, GloryEngineState> = new Map();

  private getOrCreate(entityId: string): GloryEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GloryEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'glory_engine', value: state.value }, '[GloryEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'glory_engine' }, '[GloryEngine] Reset');
  }

  getState(entityId: string): GloryEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GloryEngineState> {
    return this.states;
  }
}

export const gloryEngine = new GloryEngine();
export default gloryEngine;
