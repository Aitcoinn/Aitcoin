import { logger } from '../lib/logger.js';

/**
 * API_GATEWAY — Module #378
 * API routing and management gateway
 * Kategori: MESIN & SISTEM
 */
export interface APIGatewayState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class APIGateway {
  private states: Map<string, APIGatewayState> = new Map();

  private getOrCreate(entityId: string): APIGatewayState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): APIGatewayState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'api_gateway', value: state.value }, '[APIGateway] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'api_gateway' }, '[APIGateway] Reset');
  }

  getState(entityId: string): APIGatewayState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, APIGatewayState> {
    return this.states;
  }
}

export const apiGateway = new APIGateway();
export default apiGateway;
