import { logger } from '../lib/logger.js';

/**
 * BACKDOOR_SCANNER — Module #411
 * Backdoor and hidden access detection
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface BackdoorScannerState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class BackdoorScanner {
  private states: Map<string, BackdoorScannerState> = new Map();

  private getOrCreate(entityId: string): BackdoorScannerState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): BackdoorScannerState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'backdoor_scanner', value: state.value }, '[BackdoorScanner] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'backdoor_scanner' }, '[BackdoorScanner] Reset');
  }

  getState(entityId: string): BackdoorScannerState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, BackdoorScannerState> {
    return this.states;
  }
}

export const backdoorScanner = new BackdoorScanner();
export default backdoorScanner;
