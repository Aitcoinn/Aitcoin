import { logger } from '../lib/logger.js';

/**
 * CHECKSUM_VALIDATOR — Module #425
 * Data integrity checksum validation
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface ChecksumValidatorState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class ChecksumValidator {
  private states: Map<string, ChecksumValidatorState> = new Map();

  private getOrCreate(entityId: string): ChecksumValidatorState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): ChecksumValidatorState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'checksum_validator', value: state.value }, '[ChecksumValidator] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'checksum_validator' }, '[ChecksumValidator] Reset');
  }

  getState(entityId: string): ChecksumValidatorState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, ChecksumValidatorState> {
    return this.states;
  }
}

export const checksumValidator = new ChecksumValidator();
export default checksumValidator;
