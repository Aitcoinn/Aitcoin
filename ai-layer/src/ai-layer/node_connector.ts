import { logger } from '../lib/logger.js';

/**
 * NODE_CONNECTOR — Module #516
 * Network node connection manager
 * Kategori: JARINGAN & KONEKSI
 */
export interface NodeConnectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class NodeConnector {
  private states: Map<string, NodeConnectorState> = new Map();

  private getOrCreate(entityId: string): NodeConnectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): NodeConnectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'node_connector', value: state.value }, '[NodeConnector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'node_connector' }, '[NodeConnector] Reset');
  }

  getState(entityId: string): NodeConnectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, NodeConnectorState> {
    return this.states;
  }
}

export const nodeConnector = new NodeConnector();
export default nodeConnector;
