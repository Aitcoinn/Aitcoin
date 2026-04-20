import { logger } from '../lib/logger.js';

/**
 * EMERGENCY_PROTOCOL — Module #480
 * Emergency response protocol
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface EmergencyProtocolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EmergencyProtocol {
  private states: Map<string, EmergencyProtocolState> = new Map();

  private getOrCreate(entityId: string): EmergencyProtocolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EmergencyProtocolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'emergency_protocol', value: state.value }, '[EmergencyProtocol] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'emergency_protocol' }, '[EmergencyProtocol] Reset');
  }

  getState(entityId: string): EmergencyProtocolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EmergencyProtocolState> {
    return this.states;
  }
}

export const emergencyProtocol = new EmergencyProtocol();
export default emergencyProtocol;
