import { logger } from '../lib/logger.js';

/**
 * PROTOCOL_MANAGER — Module #376
 * Communication protocol management
 * Kategori: MESIN & SISTEM
 */
export interface ProtocolManagerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ProtocolManager {
  private states: Map<string, ProtocolManagerState> = new Map();

  private getOrCreate(entityId: string): ProtocolManagerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ProtocolManagerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'protocol_manager', value: state.value }, '[ProtocolManager] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'protocol_manager' }, '[ProtocolManager] Reset');
  }

  getState(entityId: string): ProtocolManagerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ProtocolManagerState> {
    return this.states;
  }
}

export const protocolManager = new ProtocolManager();
export default protocolManager;
