import { logger } from '../lib/logger.js';

/**
 * ANTONYM_SYSTEM — Module #656
 * Antonym detection system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface AntonymSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AntonymSystem {
  private states: Map<string, AntonymSystemState> = new Map();

  private getOrCreate(entityId: string): AntonymSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AntonymSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'antonym_system', value: state.value }, '[AntonymSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'antonym_system' }, '[AntonymSystem] Reset');
  }

  getState(entityId: string): AntonymSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AntonymSystemState> {
    return this.states;
  }
}

export const antonymSystem = new AntonymSystem();
export default antonymSystem;
