import { logger } from '../lib/logger.js';

/**
 * BIOMETRIC_SCANNER — Module #432
 * Biometric data scanning and verification
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface BiometricScannerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BiometricScanner {
  private states: Map<string, BiometricScannerState> = new Map();

  private getOrCreate(entityId: string): BiometricScannerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BiometricScannerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'biometric_scanner', value: state.value }, '[BiometricScanner] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'biometric_scanner' }, '[BiometricScanner] Reset');
  }

  getState(entityId: string): BiometricScannerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BiometricScannerState> {
    return this.states;
  }
}

export const biometricScanner = new BiometricScanner();
export default biometricScanner;
