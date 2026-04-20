import { logger } from '../lib/logger.js';

/**
 * WARNING_SIGNALER — Module #876
 * Warning signal system
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface WarningSignalerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class WarningSignaler {
  private states: Map<string, WarningSignalerState> = new Map();

  private getOrCreate(entityId: string): WarningSignalerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): WarningSignalerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'warning_signaler', value: state.value }, '[WarningSignaler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'warning_signaler' }, '[WarningSignaler] Reset');
  }

  getState(entityId: string): WarningSignalerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, WarningSignalerState> {
    return this.states;
  }
}

export const warningSignaler = new WarningSignaler();
export default warningSignaler;
