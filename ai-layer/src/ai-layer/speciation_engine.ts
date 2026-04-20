import { logger } from '../lib/logger.js';
  import { speciesCore } from './species_core.js';
  import { speciesIdentity } from './species_identity.js';

  export interface SpeciationEvent {
    id: string;
    ancestorSpeciesId: string;
    newSpecies1Id: string;
    newSpecies2Id: string;
    cause: 'geographic' | 'ecological' | 'genetic' | 'behavioral';
    completionLevel: number;
    timestamp: number;
  }

  export class SpeciationEngine {
    private events: SpeciationEvent[] = [];

    speciate(ancestorId: string, cause: SpeciationEvent['cause']): SpeciationEvent {
      const ancestor = speciesCore.get(ancestorId);
      const ts = Date.now();
      const id1 = `sp_${ts}_A`;
      const id2 = `sp_${ts}_B`;
      if (ancestor) {
        speciesCore.register({ id: id1, name: ancestor.name + '_A', kingdom: ancestor.kingdom, domain: ancestor.domain, population: Math.floor(ancestor.population / 2), fitnessAvg: ancestor.fitnessAvg });
        speciesCore.register({ id: id2, name: ancestor.name + '_B', kingdom: ancestor.kingdom, domain: ancestor.domain, population: Math.floor(ancestor.population / 2), fitnessAvg: ancestor.fitnessAvg });
        speciesCore.updatePopulation(ancestorId, -ancestor.population);
      }
      const event: SpeciationEvent = {
        id: `spec_${ts}`, ancestorSpeciesId: ancestorId, newSpecies1Id: id1, newSpecies2Id: id2,
        cause, completionLevel: 0.1 + Math.random() * 0.9, timestamp: ts
      };
      this.events.push(event);
      logger.info({ ancestorId, cause, id1, id2 }, '[SpeciationEngine] Speciation occurred');
      return event;
    }

    getEvents(): SpeciationEvent[] { return [...this.events]; }
  }

  export const speciationEngine = new SpeciationEngine();
  export default speciationEngine;
  