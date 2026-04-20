import { logger } from '../lib/logger.js';

/**
 * ROUTING_TABLE — Module #517
 * Dynamic routing table management
 * Kategori: JARINGAN & KONEKSI
 */
export interface RoutingTableState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RoutingTable {
  private states: Map<string, RoutingTableState> = new Map();

  private getOrCreate(entityId: string): RoutingTableState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RoutingTableState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'routing_table', value: state.value }, '[RoutingTable] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'routing_table' }, '[RoutingTable] Reset');
  }

  getState(entityId: string): RoutingTableState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RoutingTableState> {
    return this.states;
  }
}

export const routingTable = new RoutingTable();
export default routingTable;
