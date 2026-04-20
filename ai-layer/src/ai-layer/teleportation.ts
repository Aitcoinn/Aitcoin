import { logger } from '../lib/logger.js';

/**
 * TELEPORTATION — Module #789
 * Teleportation simulation
 * Kategori: PERSEPSI & REALITAS
 */
export interface TeleportationState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class Teleportation {
  private states: Map<string, TeleportationState> = new Map();

  private getOrCreate(entityId: string): TeleportationState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TeleportationState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'teleportation', value: state.value }, '[Teleportation] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'teleportation' }, '[Teleportation] Reset');
  }

  getState(entityId: string): TeleportationState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TeleportationState> {
    return this.states;
  }
}

export const teleportation = new Teleportation();
export default teleportation;
