import { logger } from '../lib/logger.js';

/**
 * CASTE_SYSTEM — Module #840
 * Caste hierarchy simulation
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface CasteSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CasteSystem {
  private states: Map<string, CasteSystemState> = new Map();

  private getOrCreate(entityId: string): CasteSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CasteSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'caste_system', value: state.value }, '[CasteSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'caste_system' }, '[CasteSystem] Reset');
  }

  getState(entityId: string): CasteSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CasteSystemState> {
    return this.states;
  }
}

export const casteSystem = new CasteSystem();
export default casteSystem;
