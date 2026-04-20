import { logger } from '../lib/logger.js';
  import { bodyStructure } from './body_structure.js';
  export interface DigitalAnatomy { entityId: string; systemMap: Record<string, number>; neuralDensity: number; metabolicRate: number; }
  export class AnatomyDigital {
    private anatomies: Map<string, DigitalAnatomy> = new Map();
    scan(entityId: string): DigitalAnatomy {
      const body = bodyStructure.get(entityId);
      const a: DigitalAnatomy = {
        entityId,
        systemMap: body ? Object.fromEntries(Object.entries(body.systems).map(([k,v]) => [k, v.length])) : {},
        neuralDensity: 0.7 + Math.random() * 0.3,
        metabolicRate: 1.0 + Math.random() * 0.5
      };
      this.anatomies.set(entityId, a);
      logger.info({ entityId, neuralDensity: a.neuralDensity }, '[AnatomyDigital] Anatomy scanned');
      return a;
    }
    get(entityId: string): DigitalAnatomy | null { return this.anatomies.get(entityId) ?? null; }
  }
  export const anatomyDigital = new AnatomyDigital();
  export default anatomyDigital;
  