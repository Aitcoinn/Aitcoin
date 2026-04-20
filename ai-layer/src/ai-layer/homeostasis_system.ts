import { logger } from '../lib/logger.js';
  import { physiologyEngine } from './physiology_engine.js';
  import { metabolismSystem } from './metabolism_system.js';
  import { wasteManagement } from './waste_management.js';
  export interface HomeostasisState { entityId: string; isBalanced: boolean; deviations: string[]; correctionStrength: number; }
  export class HomeostasisSystem {
    private states: Map<string, HomeostasisState> = new Map();
    regulate(entityId: string): HomeostasisState {
      const phys = physiologyEngine.get(entityId);
      const meta = metabolismSystem.get(entityId);
      const waste = wasteManagement.get(entityId);
      const deviations: string[] = [];
      if (meta && meta.energyStored < 20) deviations.push('low_energy');
      if (waste && waste.toxicity > 0.5) deviations.push('high_toxicity');
      if (phys && phys.overallHealth < 0.5) deviations.push('poor_health');
      const isBalanced = deviations.length === 0;
      if (!isBalanced) { wasteManagement.clear(entityId); if (meta && meta.energyStored < 20) metabolismSystem.feed(entityId, 10); }
      const s: HomeostasisState = { entityId, isBalanced, deviations, correctionStrength: isBalanced ? 0 : 0.8 };
      this.states.set(entityId, s);
      logger.info({ entityId, isBalanced, deviations }, '[HomeostasisSystem] Regulated');
      return s;
    }
    get(entityId: string): HomeostasisState | null { return this.states.get(entityId) ?? null; }
  }
  export const homeostasisSystem = new HomeostasisSystem();
  export default homeostasisSystem;
  