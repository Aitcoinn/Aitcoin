import { logger } from '../lib/logger.js';
  import { organSystem } from './organ_system.js';
  import { anatomyDigital } from './anatomy_digital.js';
  export interface PhysiologyState { entityId: string; heartRate: number; neuralActivity: number; immuneActivity: number; overallHealth: number; }
  export class PhysiologyEngine {
    private states: Map<string, PhysiologyState> = new Map();
    compute(entityId: string): PhysiologyState {
      const anatomy = anatomyDigital.get(entityId);
      const vitalHealth = organSystem.getVitalOrgans().map(o => o.health).reduce((s,v) => s+v,0) / Math.max(1, organSystem.getVitalOrgans().length);
      const s: PhysiologyState = {
        entityId,
        heartRate: 60 + Math.random() * 40,
        neuralActivity: anatomy?.neuralDensity ?? 0.5,
        immuneActivity: 0.5 + Math.random() * 0.5,
        overallHealth: vitalHealth
      };
      this.states.set(entityId, s);
      logger.info({ entityId, health: s.overallHealth }, '[PhysiologyEngine] Physiology computed');
      return s;
    }
    get(entityId: string): PhysiologyState | null { return this.states.get(entityId) ?? null; }
  }
  export const physiologyEngine = new PhysiologyEngine();
  export default physiologyEngine;
  