import { logger } from '../lib/logger.js';
  import { physiologyEngine } from './physiology_engine.js';
  import { immunityGenerator } from './immunity_generator.js';
  import { geneticQuality } from './genetic_quality.js';
  export interface HealthIndex { entityId: string; score: number; components: Record<string, number>; healthClass: 'excellent'|'good'|'fair'|'poor'|'critical'; }
  export class HealthIndexEngine {
    calculate(entityId: string): HealthIndex {
      const phys = physiologyEngine.get(entityId);
      const immunity = immunityGenerator.getImmunityLevel(entityId);
      const quality = geneticQuality.assess(entityId);
      const comp = { physiology: phys?.overallHealth ?? 0.5, immunity, geneticQuality: quality.qualityScore };
      const score = Object.values(comp).reduce((s,v) => s+v,0) / Object.keys(comp).length;
      const healthClass: HealthIndex['healthClass'] = score > 0.8 ? 'excellent' : score > 0.6 ? 'good' : score > 0.4 ? 'fair' : score > 0.2 ? 'poor' : 'critical';
      const h: HealthIndex = { entityId, score, components: comp, healthClass };
      logger.info({ entityId, score, healthClass }, '[HealthIndex] Health calculated');
      return h;
    }
  }
  export const healthIndex = new HealthIndexEngine();
  export default healthIndex;
  