import { logger } from '../lib/logger.js';
import { blockchainBridge } from './blockchain_bridge.js';

/**
 * DENY — Module #4951
 * Deny system
 * Kategori: SISTEM PENGATUR & REALITAS
 * Blockchain: Terhubung ke AITCOIN (ATC) melalui BlockchainBridge
 */
export interface DenyState {
  entityId: string;
  active: boolean;
  level: number;
  intensity: number;
  data: Record<string, unknown>;
  history: string[];
  connectedToChain: boolean;
  updatedAt: number;
}

export class Deny {
  private states: Map<string, DenyState> = new Map();

  constructor() {
    blockchainBridge.registerModule('deny');
  }

  private getOrCreate(entityId: string): DenyState {
    if (!this.states.has(entityId)) {
      this.states.set(entityId, {
        entityId, active: false, level: 0, intensity: 0,
        data: {}, history: [], connectedToChain: true, updatedAt: Date.now(),
      });
    }
    return this.states.get(entityId)!;
  }

  activate(entityId: string, intensity = 50): DenyState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.level = Math.min(100, state.level + 1);
    state.intensity = Math.max(0, Math.min(100, intensity));
    state.history.push(`activated:${new Date().toISOString()}`);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.updatedAt = Date.now();
    blockchainBridge.validateAIOutput('deny', { entityId, level: state.level });
    logger.info({ entityId, module: 'deny', intensity }, '[Deny] Activated');
    return state;
  }

  deactivate(entityId: string): void {
    const state = this.getOrCreate(entityId);
    state.active = false; state.intensity = 0;
    state.history.push(`deactivated:${new Date().toISOString()}`);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'deny' }, '[Deny] Deactivated');
  }

  update(entityId: string, data: Record<string, unknown>): DenyState {
    const state = this.getOrCreate(entityId);
    state.data = { ...state.data, ...data };
    state.updatedAt = Date.now();
    return state;
  }

  getState(entityId: string): DenyState | null { return this.states.get(entityId) ?? null; }
  isActive(entityId: string): boolean { return this.states.get(entityId)?.active ?? false; }
  getLevel(entityId: string): number { return this.states.get(entityId)?.level ?? 0; }
  getIntensity(entityId: string): number { return this.states.get(entityId)?.intensity ?? 0; }
  isOnChain(entityId: string): boolean { return this.states.get(entityId)?.connectedToChain ?? false; }
  reset(entityId: string): void { this.states.delete(entityId); }
  getAllActive(): string[] {
    return Array.from(this.states.entries()).filter(([,s]) => s.active).map(([id]) => id);
  }
}

export const deny = new Deny();
export default deny;
