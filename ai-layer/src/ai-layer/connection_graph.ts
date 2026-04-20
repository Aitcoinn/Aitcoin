import { logger } from '../lib/logger.js';

/**
 * CONNECTION_GRAPH — Module #583
 * Connection graph analytics
 * Kategori: JARINGAN & KONEKSI
 */
export interface ConnectionGraphState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ConnectionGraph {
  private states: Map<string, ConnectionGraphState> = new Map();

  private getOrCreate(entityId: string): ConnectionGraphState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ConnectionGraphState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'connection_graph', value: state.value }, '[ConnectionGraph] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'connection_graph' }, '[ConnectionGraph] Reset');
  }

  getState(entityId: string): ConnectionGraphState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ConnectionGraphState> {
    return this.states;
  }
}

export const connectionGraph = new ConnectionGraph();
export default connectionGraph;
