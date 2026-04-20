import { logger } from '../lib/logger.js';

/**
 * UNIVERSAL_CONNECTOR — Module #562
 * Universal system connector
 * Kategori: JARINGAN & KONEKSI
 */
export interface UniversalConnectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UniversalConnector {
  private states: Map<string, UniversalConnectorState> = new Map();

  private getOrCreate(entityId: string): UniversalConnectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UniversalConnectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'universal_connector', value: state.value }, '[UniversalConnector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'universal_connector' }, '[UniversalConnector] Reset');
  }

  getState(entityId: string): UniversalConnectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UniversalConnectorState> {
    return this.states;
  }
}

export const universalConnector = new UniversalConnector();
export default universalConnector;
