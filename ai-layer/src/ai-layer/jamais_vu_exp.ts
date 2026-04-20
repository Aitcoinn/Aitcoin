import { logger } from '../lib/logger.js';
import { blockchainBridge } from './blockchain_bridge.js';

/**
 * JAMAIS_VU_EXP — Module #9341
 * Jamais vu experience
 * Kategori: PENGALAMAN & REALITAS
 * Blockchain: Terhubung ke AITCOIN (ATC)
 */
export interface JamaisVuExpState {
  entityId: string;
  active: boolean;
  level: number;
  intensity: number;
  data: Record<string, unknown>;
  history: string[];
  connectedToChain: boolean;
  updatedAt: number;
}

export class JamaisVuExp {
  private states: Map<string, JamaisVuExpState> = new Map();

  constructor() {
    blockchainBridge.registerModule('jamais_vu_exp');
  }

  private getOrCreate(entityId: string): JamaisVuExpState {
    if (!this.states.has(entityId)) {
      this.states.set(entityId, {
        entityId, active: false, level: 0, intensity: 0,
        data: {}, history: [], connectedToChain: true, updatedAt: Date.now(),
      });
    }
    return this.states.get(entityId)!;
  }

  activate(entityId: string, intensity = 50): JamaisVuExpState {
    const state = this.getOrCreate(entityId);
    state.active = true;
    state.level = Math.min(100, state.level + 1);
    state.intensity = Math.max(0, Math.min(100, intensity));
    state.history.push(`activated:${new Date().toISOString()}`);
    if (state.history.length > 50) state.history = state.history.slice(-50);
    state.updatedAt = Date.now();
    blockchainBridge.validateAIOutput('jamais_vu_exp', { entityId, level: state.level });
    logger.info({ entityId, module: 'jamais_vu_exp', intensity }, '[JamaisVuExp] Activated');
    return state;
  }

  deactivate(entityId: string): void {
    const state = this.getOrCreate(entityId);
    state.active = false; state.intensity = 0;
    state.history.push(`deactivated:${new Date().toISOString()}`);
    state.updatedAt = Date.now();
    logger.info({ entityId, module: 'jamais_vu_exp' }, '[JamaisVuExp] Deactivated');
  }

  update(entityId: string, data: Record<string, unknown>): JamaisVuExpState {
    const state = this.getOrCreate(entityId);
    state.data = { ...state.data, ...data };
    state.updatedAt = Date.now();
    return state;
  }

  getState(entityId: string): JamaisVuExpState | null { return this.states.get(entityId) ?? null; }
  isActive(entityId: string): boolean { return this.states.get(entityId)?.active ?? false; }
  getLevel(entityId: string): number { return this.states.get(entityId)?.level ?? 0; }
  getIntensity(entityId: string): number { return this.states.get(entityId)?.intensity ?? 0; }
  isOnChain(entityId: string): boolean { return this.states.get(entityId)?.connectedToChain ?? false; }
  reset(entityId: string): void { this.states.delete(entityId); }
  getAllActive(): string[] {
    return Array.from(this.states.entries()).filter(([,s]) => s.active).map(([id]) => id);
  }
}

export const jamaisVuExp = new JamaisVuExp();
export default jamaisVuExp;
