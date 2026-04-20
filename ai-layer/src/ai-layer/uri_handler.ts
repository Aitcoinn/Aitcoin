import { logger } from '../lib/logger.js';

/**
 * URI_HANDLER — Module #577
 * URI handling and resolution
 * Kategori: JARINGAN & KONEKSI
 */
export interface URIHandlerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class URIHandler {
  private states: Map<string, URIHandlerState> = new Map();

  private getOrCreate(entityId: string): URIHandlerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): URIHandlerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'uri_handler', value: state.value }, '[URIHandler] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'uri_handler' }, '[URIHandler] Reset');
  }

  getState(entityId: string): URIHandlerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, URIHandlerState> {
    return this.states;
  }
}

export const uriHandler = new URIHandler();
export default uriHandler;
