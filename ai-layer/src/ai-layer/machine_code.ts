import { logger } from '../lib/logger.js';

/**
 * MACHINE_CODE — Module #635
 * Machine code translator
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface MachineCodeState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class MachineCode {
  private states: Map<string, MachineCodeState> = new Map();

  private getOrCreate(entityId: string): MachineCodeState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): MachineCodeState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'machine_code', value: state.value }, '[MachineCode] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'machine_code' }, '[MachineCode] Reset');
  }

  getState(entityId: string): MachineCodeState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, MachineCodeState> {
    return this.states;
  }
}

export const machineCode = new MachineCode();
export default machineCode;
