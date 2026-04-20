import { logger } from '../lib/logger.js';

/**
 * PORTAL_SYSTEM — Module #788
 * Interdimensional portal system
 * Kategori: PERSEPSI & REALITAS
 */
export interface PortalSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class PortalSystem {
  private states: Map<string, PortalSystemState> = new Map();

  private getOrCreate(entityId: string): PortalSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): PortalSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'portal_system', value: state.value }, '[PortalSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'portal_system' }, '[PortalSystem] Reset');
  }

  getState(entityId: string): PortalSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, PortalSystemState> {
    return this.states;
  }
}

export const portalSystem = new PortalSystem();
export default portalSystem;
