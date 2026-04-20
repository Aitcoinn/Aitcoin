import { logger } from '../lib/logger.js';

/**
 * LINK_ESTABLISHMENT — Module #501
 * Network link establishment
 * Kategori: JARINGAN & KONEKSI
 */
export interface LinkEstablishmentState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class LinkEstablishment {
  private states: Map<string, LinkEstablishmentState> = new Map();

  private getOrCreate(entityId: string): LinkEstablishmentState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): LinkEstablishmentState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'link_establishment', value: state.value }, '[LinkEstablishment] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'link_establishment' }, '[LinkEstablishment] Reset');
  }

  getState(entityId: string): LinkEstablishmentState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, LinkEstablishmentState> {
    return this.states;
  }
}

export const linkEstablishment = new LinkEstablishment();
export default linkEstablishment;
