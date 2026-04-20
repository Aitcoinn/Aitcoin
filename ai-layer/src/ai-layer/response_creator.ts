import { logger } from '../lib/logger.js';

/**
 * RESPONSE_CREATOR — Module #678
 * Response creation system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface ResponseCreatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ResponseCreator {
  private states: Map<string, ResponseCreatorState> = new Map();

  private getOrCreate(entityId: string): ResponseCreatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ResponseCreatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'response_creator', value: state.value }, '[ResponseCreator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'response_creator' }, '[ResponseCreator] Reset');
  }

  getState(entityId: string): ResponseCreatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ResponseCreatorState> {
    return this.states;
  }
}

export const responseCreator = new ResponseCreator();
export default responseCreator;
