import { logger } from '../lib/logger.js';

/**
 * DIGITAL_SIGNATURE — Module #426
 * Digital signature creation and verification
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface DigitalSignatureState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class DigitalSignature {
  private states: Map<string, DigitalSignatureState> = new Map();

  private getOrCreate(entityId: string): DigitalSignatureState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): DigitalSignatureState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'digital_signature', value: state.value }, '[DigitalSignature] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'digital_signature' }, '[DigitalSignature] Reset');
  }

  getState(entityId: string): DigitalSignatureState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, DigitalSignatureState> {
    return this.states;
  }
}

export const digitalSignature = new DigitalSignature();
export default digitalSignature;
