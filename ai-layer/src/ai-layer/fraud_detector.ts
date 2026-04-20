import { logger } from '../lib/logger.js';

/**
 * FRAUD_DETECTOR — Module #452
 * Fraud detection and prevention
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface FraudDetectorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class FraudDetector {
  private states: Map<string, FraudDetectorState> = new Map();

  private getOrCreate(entityId: string): FraudDetectorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): FraudDetectorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'fraud_detector', value: state.value }, '[FraudDetector] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'fraud_detector' }, '[FraudDetector] Reset');
  }

  getState(entityId: string): FraudDetectorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, FraudDetectorState> {
    return this.states;
  }
}

export const fraudDetector = new FraudDetector();
export default fraudDetector;
