import { logger } from '../lib/logger.js';

/**
 * CHARACTER_SET — Module #645
 * Character set definition and management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface CharacterSetState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CharacterSet {
  private states: Map<string, CharacterSetState> = new Map();

  private getOrCreate(entityId: string): CharacterSetState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CharacterSetState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'character_set', value: state.value }, '[CharacterSet] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'character_set' }, '[CharacterSet] Reset');
  }

  getState(entityId: string): CharacterSetState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CharacterSetState> {
    return this.states;
  }
}

export const characterSet = new CharacterSet();
export default characterSet;
