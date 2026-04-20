import { logger } from '../lib/logger.js';
  import { recombinationSystem } from './recombination_system.js';
  import { traitInheritance } from './trait_inheritance.js';
  import { chromosomeSystem } from './chromosome_system.js';

  export interface SexualReproductionEvent {
    id: string;
    parent1Id: string;
    parent2Id: string;
    offspringId: string;
    traitsInherited: string[];
    geneticDiversity: number;
    timestamp: number;
  }

  export class SexualReproduction {
    private events: SexualReproductionEvent[] = [];

    reproduce(parent1Id: string, parent2Id: string): SexualReproductionEvent {
      const offspringId = `offspring_${Date.now()}`;
      const p1Traits = traitInheritance.getTraits(parent1Id);
      const p2Traits = traitInheritance.getTraits(parent2Id);
      const inherited = traitInheritance.inheritTraits(offspringId, p1Traits, p2Traits);
      const pair = chromosomeSystem.getChromosomePair(1);
      if (pair.length >= 2) recombinationSystem.recombine(pair[0], pair[1]);
      const event: SexualReproductionEvent = {
        id: `sr_${Date.now()}`,
        parent1Id, parent2Id, offspringId,
        traitsInherited: inherited.map(t => t.name),
        geneticDiversity: inherited.filter(t => t.inheritedFrom === 'both').length / Math.max(1, inherited.length),
        timestamp: Date.now()
      };
      this.events.push(event);
      logger.info({ parent1Id, parent2Id, offspringId, diversity: event.geneticDiversity }, '[SexualReproduction] Offspring created');
      return event;
    }

    getEvents(): SexualReproductionEvent[] { return [...this.events]; }
  }

  export const sexualReproduction = new SexualReproduction();
  export default sexualReproduction;
  