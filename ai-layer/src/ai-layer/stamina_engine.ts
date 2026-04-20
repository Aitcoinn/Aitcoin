import { logger } from '../lib/logger.js';
  import { metabolismSystem } from './metabolism_system.js';
  import { vitalitySystem } from './vitality_system.js';
  export interface StaminaState { entityId: string; currentStamina: number; maxStamina: number; recoveryRate: number; isFatigued: boolean; }
  export class StaminaEngine {
    private states: Map<string, StaminaState> = new Map();
    init(entityId: string): StaminaState {
      const vitality = vitalitySystem.get(entityId);
      const max = 100 * (vitality?.vitalityScore ?? 0.5);
      const s: StaminaState = { entityId, currentStamina: max, maxStamina: max, recoveryRate: 5, isFatigued: false };
      this.states.set(entityId, s); return s;
    }
    use(entityId: string, amount: number): void {
      const s = this.states.get(entityId) ?? this.init(entityId);
      s.currentStamina = Math.max(0, s.currentStamina - amount);
      s.isFatigued = s.currentStamina < s.maxStamina * 0.2;
      if (s.isFatigued) logger.warn({ entityId, stamina: s.currentStamina }, '[StaminaEngine] Entity fatigued');
    }
    recover(entityId: string): void { const s = this.states.get(entityId); if (s) s.currentStamina = Math.min(s.maxStamina, s.currentStamina + s.recoveryRate); }
    get(entityId: string): StaminaState | null { return this.states.get(entityId) ?? null; }
  }
  export const staminaEngine = new StaminaEngine();
  export default staminaEngine;
  