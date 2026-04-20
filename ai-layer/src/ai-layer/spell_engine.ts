import { logger } from '../lib/logger.js';

/**
 * SPELL_ENGINE — Module #917
 * Spell casting engine
 * Kategori: KEKUATAN & MASA DEPAN
 */
export interface SpellEngineState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SpellEngine {
  private states: Map<string, SpellEngineState> = new Map();

  private getOrCreate(entityId: string): SpellEngineState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SpellEngineState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'spell_engine', value: state.value }, '[SpellEngine] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'spell_engine' }, '[SpellEngine] Reset');
  }

  getState(entityId: string): SpellEngineState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SpellEngineState> {
    return this.states;
  }
}

export const spellEngine = new SpellEngine();
export default spellEngine;
