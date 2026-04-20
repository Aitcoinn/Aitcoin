import { logger } from '../lib/logger.js';

/**
 * INTERSTELLAR_COMMS — Module #592
 * Interstellar communication system
 * Kategori: JARINGAN & KONEKSI
 */
export interface InterstellarCommsState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InterstellarComms {
  private states: Map<string, InterstellarCommsState> = new Map();

  private getOrCreate(entityId: string): InterstellarCommsState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InterstellarCommsState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'interstellar_comms', value: state.value }, '[InterstellarComms] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'interstellar_comms' }, '[InterstellarComms] Reset');
  }

  getState(entityId: string): InterstellarCommsState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InterstellarCommsState> {
    return this.states;
  }
}

export const interstellarComms = new InterstellarComms();
export default interstellarComms;
