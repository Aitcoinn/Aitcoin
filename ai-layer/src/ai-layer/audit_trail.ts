import { logger } from '../lib/logger.js';

/**
 * AUDIT_TRAIL — Module #446
 * Security audit trail logging
 * Kategori: KEAMANAN & PERTAHANAN
 */
export interface AuditTrailState {
  entityId: string;
  active: boolean;
  value: number;
  data: Record<string, unknown>;
  updatedAt: number;
}

export class AuditTrail {
  private states: Map<string, AuditTrailState> = new Map();

  private getOrCreate(entityId: string): AuditTrailState {
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

  execute(entityId: string, input: Record<string, unknown> = {}): AuditTrailState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.value = (state.value + 1) % 1000;
    state.data = { ...state.data, ...input, lastExecution: Date.now() };
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'audit_trail', value: state.value }, '[AuditTrail] Executed');
    return state;
  }

  reset(entityId: string): void {
    this.states.delete(entityId);
    logger.info({ entityId, module: 'audit_trail' }, '[AuditTrail] Reset');
  }

  getState(entityId: string): AuditTrailState | null {
    return this.states.get(entityId) ?? null;
  }

  isActive(entityId: string): boolean {
    return this.states.get(entityId)?.active ?? false;
  }

  getValue(entityId: string): number {
    return this.states.get(entityId)?.value ?? 0;
  }

  getAllStates(): Map<string, AuditTrailState> {
    return this.states;
  }
}

export const auditTrail = new AuditTrail();
export default auditTrail;
