import { logger } from '../lib/logger.js';

/**
 * INSTRUCTION_INTERPRETER — Module #674
 * Instruction interpretation engine
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface InstructionInterpreterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class InstructionInterpreter {
  private states: Map<string, InstructionInterpreterState> = new Map();

  private getOrCreate(entityId: string): InstructionInterpreterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): InstructionInterpreterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'instruction_interpreter', value: state.value }, '[InstructionInterpreter] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'instruction_interpreter' }, '[InstructionInterpreter] Reset');
  }

  getState(entityId: string): InstructionInterpreterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, InstructionInterpreterState> {
    return this.states;
  }
}

export const instructionInterpreter = new InstructionInterpreter();
export default instructionInterpreter;
