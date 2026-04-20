import { logger } from '../lib/logger.js';

/**
 * ROOT_ACCESS — Module #444
 * Root-level access control
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface RootAccessState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class RootAccess {
  private states: Map<string, RootAccessState> = new Map();

  private getOrCreate(entityId: string): RootAccessState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): RootAccessState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'root_access', value: state.value }, '[RootAccess] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'root_access' }, '[RootAccess] Reset');
  }

  getState(entityId: string): RootAccessState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, RootAccessState> {
    return this.states;
  }
}

export const rootAccess = new RootAccess();
export default rootAccess;
