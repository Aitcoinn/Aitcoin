import { logger } from '../lib/logger.js';

/**
 * SHARING_CULTURE — Module #884
 * Sharing culture promotion
 * Kategori: MASYARAKAT & SOSIAL
 */
export interface SharingCultureState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class SharingCulture {
  private states: Map<string, SharingCultureState> = new Map();

  private getOrCreate(entityId: string): SharingCultureState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): SharingCultureState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'sharing_culture', value: state.value }, '[SharingCulture] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'sharing_culture' }, '[SharingCulture] Reset');
  }

  getState(entityId: string): SharingCultureState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, SharingCultureState> {
    return this.states;
  }
}

export const sharingCulture = new SharingCulture();
export default sharingCulture;
