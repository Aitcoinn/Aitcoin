import { logger } from '../lib/logger.js';

/**
 * SOAP_SERVICE — Module #512
 * SOAP web service implementation
 * Kategori: JARINGAN & KONEKSI
 */
export interface SOAPServiceState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SOAPService {
  private states: Map<string, SOAPServiceState> = new Map();

  private getOrCreate(entityId: string): SOAPServiceState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SOAPServiceState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'soap_service', value: state.value }, '[SOAPService] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'soap_service' }, '[SOAPService] Reset');
  }

  getState(entityId: string): SOAPServiceState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SOAPServiceState> {
    return this.states;
  }
}

export const soapService = new SOAPService();
export default soapService;
