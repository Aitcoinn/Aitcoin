import { logger } from '../lib/logger.js';

/**
 * SIGNAL_BROADCASTER — Module #537
 * Signal broadcast system
 * Kategori: JARINGAN & KONEKSI
 */
export interface SignalBroadcasterState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SignalBroadcaster {
  private states: Map<string, SignalBroadcasterState> = new Map();

  private getOrCreate(entityId: string): SignalBroadcasterState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SignalBroadcasterState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'signal_broadcaster', value: state.value }, '[SignalBroadcaster] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'signal_broadcaster' }, '[SignalBroadcaster] Reset');
  }

  getState(entityId: string): SignalBroadcasterState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SignalBroadcasterState> {
    return this.states;
  }
}

export const signalBroadcaster = new SignalBroadcaster();
export default signalBroadcaster;
