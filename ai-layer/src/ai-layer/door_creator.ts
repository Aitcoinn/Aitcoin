import { logger } from '../lib/logger.js';

/**
 * DOOR_CREATOR — Module #787
 * Gateway creation system
 * Kategori: PERSEPSI & REALITAS
 */
export interface DoorCreatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DoorCreator {
  private states: Map<string, DoorCreatorState> = new Map();

  private getOrCreate(entityId: string): DoorCreatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DoorCreatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'door_creator', value: state.value }, '[DoorCreator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'door_creator' }, '[DoorCreator] Reset');
  }

  getState(entityId: string): DoorCreatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DoorCreatorState> {
    return this.states;
  }
}

export const doorCreator = new DoorCreator();
export default doorCreator;
