import { logger } from '../lib/logger.js';

/**
 * ACCENT_SYSTEM — Module #604
 * Language accent management
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface AccentSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AccentSystem {
  private states: Map<string, AccentSystemState> = new Map();

  private getOrCreate(entityId: string): AccentSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AccentSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'accent_system', value: state.value }, '[AccentSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'accent_system' }, '[AccentSystem] Reset');
  }

  getState(entityId: string): AccentSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AccentSystemState> {
    return this.states;
  }
}

export const accentSystem = new AccentSystem();
export default accentSystem;
