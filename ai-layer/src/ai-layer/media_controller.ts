import { logger } from '../lib/logger.js';

/**
 * MEDIA_CONTROLLER — Module #869
 * Media control system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface MediaControllerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MediaController {
  private states: Map<string, MediaControllerState> = new Map();

  private getOrCreate(entityId: string): MediaControllerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MediaControllerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'media_controller', value: state.value }, '[MediaController] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'media_controller' }, '[MediaController] Reset');
  }

  getState(entityId: string): MediaControllerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MediaControllerState> {
    return this.states;
  }
}

export const mediaController = new MediaController();
export default mediaController;
