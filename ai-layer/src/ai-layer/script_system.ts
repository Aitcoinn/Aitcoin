import { logger } from '../lib/logger.js';

/**
 * SCRIPT_SYSTEM — Module #643
 * Writing script management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ScriptSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ScriptSystem {
  private states: Map<string, ScriptSystemState> = new Map();

  private getOrCreate(entityId: string): ScriptSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ScriptSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'script_system', value: state.value }, '[ScriptSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'script_system' }, '[ScriptSystem] Reset');
  }

  getState(entityId: string): ScriptSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ScriptSystemState> {
    return this.states;
  }
}

export const scriptSystem = new ScriptSystem();
export default scriptSystem;
