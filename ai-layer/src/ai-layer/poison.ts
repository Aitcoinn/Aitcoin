import { logger } from '../lib/logger.js';
import { blockchainBridge } from './blockchain_bridge.js';

/**
 * POISON — Module #4798
 * Poison system
 * Kategori: KIMIA & ZAT
 * Blockchain: Terhubung ke AITCOIN (ATC) melalui BlockchainBridge
 */
export interface PoisonState {
  entityId: string;
  active: boolean;
  level: number;
  intensity: number;
  data: Record<string, unknown>;
  history: string[];
  connectedToChain: boolean;
  updatedAt: number;
}

export class Poison {
  private states: Map<string, PoisonState> = new Map();

  constructor() {
    blockchainBridge.registerModule('poison');
  }

  private getOrCreate(entityId: string): PoisonState {
    if (!this.states.has(entityId)) {
      this.states.set(entityId, {
        entityId, active: false, level: 0, intensity: 0,
        data: {}, history: [], connectedToChain: true, updatedAt: Date.now(),
      });
    }
    return this.states.get(entityId)!;
  }

  activate(entityId: string, intensity = 50): PoisonState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.level = Math.min(100, state.level + 1);
    state.intensity = Math.max(0, Math.min(100, intensity));
    state.history.push(`activated:${new Date().toISOString()}`);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.updatedAt = Date.now();
    blockchainBridge.validateAIOutput('poison', { entityId, level: state.level });
    logger.info({ entityId, module: 'poison', intensity }, '[Poison] Activated');
    return state;
  }

  deactivate(entityId: string): void {
    const state = this.getOrCreate(entityId);
    state.active = false; state.intensity = 0;
    state.history.push(`deactivated:${new Date().toISOString()}`);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'poison' }, '[Poison] Deactivated');
  }

  update(entityId: string, data: Record<string, unknown>): PoisonState {
    const state = this.getOrCreate(entityId);
    state.data = { ...state.data, ...data };
    state.updatedAt = Date.now();
    return state;
  }

  getState(entityId: string): PoisonState | null { return this.states.get(entityId) ?? null; }
  isActive(entityId: string): boolean { return this.states.get(entityId)?.active ?? false; }
  getLevel(entityId: string): number { return this.states.get(entityId)?.level ?? 0; }
  getIntensity(entityId: string): number { return this.states.get(entityId)?.intensity ?? 0; }
  isOnChain(entityId: string): boolean { return this.states.get(entityId)?.connectedToChain ?? false; }
  reset(entityId: string): void { this.states.delete(entityId); }
  getAllActive(): string[] {
    return Array.from(this.states.entries()).filter(([,s]) => s.active).map(([id]) => id);
  }
}

export const poison = new Poison();
export default poison;
