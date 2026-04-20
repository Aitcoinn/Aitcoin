import { logger } from '../lib/logger.js';

/**
 * CAMOUFLAGE_SYSTEM — Module #415
 * Identity camouflage and masking
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface CamouflageSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class CamouflageSystem {
  private states: Map<string, CamouflageSystemState> = new Map();

  private getOrCreate(entityId: string): CamouflageSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): CamouflageSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'camouflage_system', value: state.value }, '[CamouflageSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'camouflage_system' }, '[CamouflageSystem] Reset');
  }

  getState(entityId: string): CamouflageSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, CamouflageSystemState> {
    return this.states;
  }
}

export const camouflageSystem = new CamouflageSystem();
export default camouflageSystem;
