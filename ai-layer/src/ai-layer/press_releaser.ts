import { logger } from '../lib/logger.js';

/**
 * PRESS_RELEASER — Module #872
 * Press release system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface PressReleaserState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PressReleaser {
  private states: Map<string, PressReleaserState> = new Map();

  private getOrCreate(entityId: string): PressReleaserState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PressReleaserState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'press_releaser', value: state.value }, '[PressReleaser] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'press_releaser' }, '[PressReleaser] Reset');
  }

  getState(entityId: string): PressReleaserState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PressReleaserState> {
    return this.states;
  }
}

export const pressReleaser = new PressReleaser();
export default pressReleaser;
