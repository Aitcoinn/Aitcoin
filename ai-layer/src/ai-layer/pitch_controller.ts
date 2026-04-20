import { logger } from '../lib/logger.js';

/**
 * PITCH_CONTROLLER — Module #606
 * Voice pitch control
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface PitchControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PitchController {
  private states: Map<string, PitchControllerState> = new Map();

  private getOrCreate(entityId: string): PitchControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PitchControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'pitch_controller', value: state.value }, '[PitchController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'pitch_controller' }, '[PitchController] Reset');
  }

  getState(entityId: string): PitchControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PitchControllerState> {
    return this.states;
  }
}

export const pitchController = new PitchController();
export default pitchController;
