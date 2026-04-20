import { logger } from '../lib/logger.js';

/**
 * GATEWAY_SYSTEM — Module #564
 * Network gateway system
 * Kategori: JARINGAN & KONEKSI
 */
export interface GatewaySystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GatewaySystem {
  private states: Map<string, GatewaySystemState> = new Map();

  private getOrCreate(entityId: string): GatewaySystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GatewaySystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'gateway_system', value: state.value }, '[GatewaySystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'gateway_system' }, '[GatewaySystem] Reset');
  }

  getState(entityId: string): GatewaySystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GatewaySystemState> {
    return this.states;
  }
}

export const gatewaySystem = new GatewaySystem();
export default gatewaySystem;
