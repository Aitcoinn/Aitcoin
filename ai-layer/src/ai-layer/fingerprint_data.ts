import { logger } from '../lib/logger.js';

/**
 * FINGERPRINT_DATA — Module #433
 * Fingerprint pattern storage and matching
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface FingerprintDataState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FingerprintData {
  private states: Map<string, FingerprintDataState> = new Map();

  private getOrCreate(entityId: string): FingerprintDataState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FingerprintDataState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'fingerprint_data', value: state.value }, '[FingerprintData] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'fingerprint_data' }, '[FingerprintData] Reset');
  }

  getState(entityId: string): FingerprintDataState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FingerprintDataState> {
    return this.states;
  }
}

export const fingerprintData = new FingerprintData();
export default fingerprintData;
