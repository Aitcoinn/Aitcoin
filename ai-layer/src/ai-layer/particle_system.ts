import { logger } from '../lib/logger.js';

/**
 * PARTICLE_SYSTEM — Module #779
 * Particle simulation system
 * Kategori: PERSEPSI & REALITAS
 */
export interface ParticleSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ParticleSystem {
  private states: Map<string, ParticleSystemState> = new Map();

  private getOrCreate(entityId: string): ParticleSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ParticleSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'particle_system', value: state.value }, '[ParticleSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'particle_system' }, '[ParticleSystem] Reset');
  }

  getState(entityId: string): ParticleSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ParticleSystemState> {
    return this.states;
  }
}

export const particleSystem = new ParticleSystem();
export default particleSystem;
