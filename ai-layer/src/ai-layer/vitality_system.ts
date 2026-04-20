import { logger } from '../lib/logger.js';
  import { metabolismSystem } from './metabolism_system.js';
  import { healthIndex } from './health_index.js';
  export interface VitalityState { entityId: string; vitalityScore: number; energyReserve: number; regenerationRate: number; peakVitality: number; }
  export class VitalitySystem {
    private states: Map<string, VitalityState> = new Map();
    compute(entityId: string): VitalityState {
      const meta = metabolismSystem.get(entityId);
      const health = healthIndex.calculate(entityId);
      const vitality = health.score * (meta ? meta.energyStored / 100 : 0.5);
      const s: VitalityState = { entityId, vitalityScore: vitality, energyReserve: meta?.energyStored ?? 50, regenerationRate: vitality * 0.1, peakVitality: Math.max(vitality, this.states.get(entityId)?.peakVitality ?? 0) };
      this.states.set(entityId, s);
      logger.info({ entityId, vitality }, '[VitalitySystem] Vitality computed');
      return s;
    }
    get(entityId: string): VitalityState | null { return this.states.get(entityId) ?? null; }
  }
  export const vitalitySystem = new VitalitySystem();
  export default vitalitySystem;
  