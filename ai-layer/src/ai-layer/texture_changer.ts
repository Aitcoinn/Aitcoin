import { logger } from '../lib/logger.js';

/**
 * TEXTURE_CHANGER — Module #932
 * Texture modification system
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface TextureChangerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TextureChanger {
  private states: Map<string, TextureChangerState> = new Map();

  private getOrCreate(entityId: string): TextureChangerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TextureChangerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'texture_changer', value: state.value }, '[TextureChanger] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'texture_changer' }, '[TextureChanger] Reset');
  }

  getState(entityId: string): TextureChangerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TextureChangerState> {
    return this.states;
  }
}

export const textureChanger = new TextureChanger();
export default textureChanger;
