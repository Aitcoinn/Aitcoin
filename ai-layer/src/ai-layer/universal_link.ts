import { logger } from '../lib/logger.js';

/**
 * UNIVERSAL_LINK — Module #598
 * Universal communication link
 * Kategori: JARINGAN & KONEKSI
 */
export interface UniversalLinkState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class UniversalLink {
  private states: Map<string, UniversalLinkState> = new Map();

  private getOrCreate(entityId: string): UniversalLinkState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): UniversalLinkState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'universal_link', value: state.value }, '[UniversalLink] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'universal_link' }, '[UniversalLink] Reset');
  }

  getState(entityId: string): UniversalLinkState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, UniversalLinkState> {
    return this.states;
  }
}

export const universalLink = new UniversalLink();
export default universalLink;
