import { logger } from '../lib/logger.js';

/**
 * COMMAND_PATTERN — Module #388
 * Command queue and execution pattern
 * Kategori: MESIN & SISTEM
 */
export interface CommandPatternState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CommandPattern {
  private states: Map<string, CommandPatternState> = new Map();

  private getOrCreate(entityId: string): CommandPatternState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CommandPatternState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'command_pattern', value: state.value }, '[CommandPattern] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'command_pattern' }, '[CommandPattern] Reset');
  }

  getState(entityId: string): CommandPatternState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CommandPatternState> {
    return this.states;
  }
}

export const commandPattern = new CommandPattern();
export default commandPattern;
