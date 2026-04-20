import { logger } from '../lib/logger.js';

/**
 * RPC_PROTOCOL — Module #513
 * Remote procedure call protocol
 * Kategori: JARINGAN & KONEKSI
 */
export interface RPCProtocolState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RPCProtocol {
  private states: Map<string, RPCProtocolState> = new Map();

  private getOrCreate(entityId: string): RPCProtocolState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RPCProtocolState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'rpc_protocol', value: state.value }, '[RPCProtocol] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'rpc_protocol' }, '[RPCProtocol] Reset');
  }

  getState(entityId: string): RPCProtocolState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RPCProtocolState> {
    return this.states;
  }
}

export const rpcProtocol = new RPCProtocol();
export default rpcProtocol;
