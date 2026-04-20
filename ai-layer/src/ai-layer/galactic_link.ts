import { logger } from '../lib/logger.js';

/**
 * GALACTIC_LINK — Module #591
 * Galactic link management
 * Kategori: JARINGAN & KONEKSI
 */
export interface GalacticLinkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GalacticLink {
  private states: Map<string, GalacticLinkState> = new Map();

  private getOrCreate(entityId: string): GalacticLinkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GalacticLinkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'galactic_link', value: state.value }, '[GalacticLink] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'galactic_link' }, '[GalacticLink] Reset');
  }

  getState(entityId: string): GalacticLinkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GalacticLinkState> {
    return this.states;
  }
}

export const galacticLink = new GalacticLink();
export default galacticLink;
