import { logger } from '../lib/logger.js';

/**
 * HEX_SYSTEM — Module #637
 * Hexadecimal encoding system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface HexSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class HexSystem {
  private states: Map<string, HexSystemState> = new Map();

  private getOrCreate(entityId: string): HexSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): HexSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'hex_system', value: state.value }, '[HexSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'hex_system' }, '[HexSystem] Reset');
  }

  getState(entityId: string): HexSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, HexSystemState> {
    return this.states;
  }
}

export const hexSystem = new HexSystem();
export default hexSystem;
