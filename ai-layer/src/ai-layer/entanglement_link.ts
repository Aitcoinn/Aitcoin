import { logger } from '../lib/logger.js';

/**
 * ENTANGLEMENT_LINK — Module #782
 * Quantum entanglement link
 * Kategori: PERSEPSI & REALITAS
 */
export interface EntanglementLinkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class EntanglementLink {
  private states: Map<string, EntanglementLinkState> = new Map();

  private getOrCreate(entityId: string): EntanglementLinkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): EntanglementLinkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'entanglement_link', value: state.value }, '[EntanglementLink] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'entanglement_link' }, '[EntanglementLink] Reset');
  }

  getState(entityId: string): EntanglementLinkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, EntanglementLinkState> {
    return this.states;
  }
}

export const entanglementLink = new EntanglementLink();
export default entanglementLink;
