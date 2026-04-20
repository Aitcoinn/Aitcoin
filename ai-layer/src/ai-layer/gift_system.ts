import { logger } from '../lib/logger.js';

/**
 * GIFT_SYSTEM — Module #697
 * Gift exchange system
 * Kategori: BAHASA & KOMUNIKASI
 */
export interface GiftSystemState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class GiftSystem {
  private states: Map<string, GiftSystemState> = new Map();

  private getOrCreate(entityId: string): GiftSystemState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): GiftSystemState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'gift_system', value: state.value }, '[GiftSystem] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'gift_system' }, '[GiftSystem] Reset');
  }

  getState(entityId: string): GiftSystemState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, GiftSystemState> {
    return this.states;
  }
}

export const giftSystem = new GiftSystem();
export default giftSystem;
