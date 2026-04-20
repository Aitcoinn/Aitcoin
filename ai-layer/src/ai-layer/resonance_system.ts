import { logger } from '../lib/logger.js';

/**
 * RESONANCE_SYSTEM — Module #758
 * Resonance detection and management
 * Kategori: PERSEPSI & REALITAS
 */
export interface ResonanceSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ResonanceSystem {
  private states: Map<string, ResonanceSystemState> = new Map();

  private getOrCreate(entityId: string): ResonanceSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ResonanceSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'resonance_system', value: state.value }, '[ResonanceSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'resonance_system' }, '[ResonanceSystem] Reset');
  }

  getState(entityId: string): ResonanceSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ResonanceSystemState> {
    return this.states;
  }
}

export const resonanceSystem = new ResonanceSystem();
export default resonanceSystem;
