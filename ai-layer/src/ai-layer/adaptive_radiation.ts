import { logger } from '../lib/logger.js';
  import { speciationEngine } from './speciation_engine.js';
  import { speciesCore } from './species_core.js';
  export interface RadiationEvent { ancestorId: string; descendants: string[]; nichesFilled: string[]; radiationSpeed: number; timestamp: number; }
  export class AdaptiveRadiation {
    private events: RadiationEvent[] = [];
    radiate(ancestorId: string, niches: string[]): RadiationEvent {
      const descendants: string[] = [];
      for (const niche of niches.slice(0,3)) {
        const spec = speciationEngine.speciate(ancestorId, 'ecological');
        descendants.push(spec.newSpecies1Id);
      }
      const e: RadiationEvent = { ancestorId, descendants, nichesFilled: niches, radiationSpeed: 0.5 + Math.random() * 0.5, timestamp: Date.now() };
      this.events.push(e);
      logger.info({ ancestorId, descendantCount: descendants.length }, '[AdaptiveRadiation] Radiation occurred');
      return e;
    }
    getEvents(): RadiationEvent[] { return [...this.events]; }
  }
  export const adaptiveRadiation = new AdaptiveRadiation();
  export default adaptiveRadiation;
  