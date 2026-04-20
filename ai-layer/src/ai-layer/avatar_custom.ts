import { logger } from '../lib/logger.js';

/**
 * AVATAR_CUSTOM — Module #930
 * Avatar customization system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface AvatarCustomState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AvatarCustom {
  private states: Map<string, AvatarCustomState> = new Map();

  private getOrCreate(entityId: string): AvatarCustomState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AvatarCustomState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'avatar_custom', value: state.value }, '[AvatarCustom] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'avatar_custom' }, '[AvatarCustom] Reset');
  }

  getState(entityId: string): AvatarCustomState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AvatarCustomState> {
    return this.states;
  }
}

export const avatarCustom = new AvatarCustom();
export default avatarCustom;
