import { logger } from '../lib/logger.js';

/**
 * TCP_IP_STACK — Module #505
 * TCP/IP protocol stack simulation
 * Kategori: JARINGAN & KONEKSI
 */
export interface TCPIPStackState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class TCPIPStack {
  private states: Map<string, TCPIPStackState> = new Map();

  private getOrCreate(entityId: string): TCPIPStackState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): TCPIPStackState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'tcp_ip_stack', value: state.value }, '[TCPIPStack] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'tcp_ip_stack' }, '[TCPIPStack] Reset');
  }

  getState(entityId: string): TCPIPStackState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, TCPIPStackState> {
    return this.states;
  }
}

export const tcpIpStack = new TCPIPStack();
export default tcpIpStack;
